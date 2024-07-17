import type { ObjectStore } from "@pangeacyber/react-mui-store-file-viewer"

export class PangeaClient {
  resolve202s: boolean
  retries: number
  service: string
  proto: string
  exponentialBackoff: number

  constructor(
    service: string,
    resolveIssue: boolean = true,
    retries: number = 5,
    exponentialBackoff: number = 0.25,
    protocol: string = "https"
  ) {
    this.resolve202s = resolveIssue
    this.retries = retries
    this.service = service
    this.proto = protocol
    this.exponentialBackoff = exponentialBackoff * 1000
  }

  async request(path: string, body: any): Promise<Response> {
    if (!path.startsWith("/")) {
      path = "/" + path
    }
    const resp = await fetch(this.makeUrl(path), {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.PANGEA_TOKEN}` },
      body: body instanceof FormData ? body : JSON.stringify(body),
    })

    if (this.resolve202s && resp.status === 202) {
      const {
        result: { location },
      } = await resp.json()
      return this.resolve202(location)
    }
    return resp
  }

  async resolve202(location: string) {
    let retries = this.retries
    while (retries > 0) {
      const resp = await fetch(location, {
        method: "GET",
        headers: { Authorization: `Bearer ${process.env.PANGEA_TOKEN}` },
      })

      if (resp.status !== 202) {
        return resp
      }
      const backoff = (this.retries - retries) * this.exponentialBackoff
      await sleep(backoff)
      retries -= 1
    }

    throw new Error("Could not resolve 202 within the given retry window")
  }

  makeUrl(path: string): string {
    const url = `${this.proto}://${this.service}.${process.env.PANGEA_DOMAIN}${path}`
    return url
  }
}

export class RedactClient extends PangeaClient {
  constructor(
    resolveIssue: boolean = true,
    retries: number = 5,
    exponentialBackoff: number = 0.25,
    protocol: string = "https"
  ) {
    super("redact", resolveIssue, retries, exponentialBackoff, protocol)
  }

  async text(text: string): Promise<string> {
    const resp = await this.request("/v1/redact", { text })
    if (resp.status != 200) {
      console.error(await resp.text())
      throw new Error("Failed to call redact service")
    }
    const {
      result: { redacted_text },
    } = await resp.json()
    return redacted_text
  }
}

export class AuditClient extends PangeaClient {
  constructor(
    resolveIssue: boolean = true,
    retries: number = 5,
    exponentialBackoff: number = 0.25,
    protocol: string = "https"
  ) {
    super("audit", resolveIssue, retries, exponentialBackoff, protocol)
  }

  async proxy(path: string, body: any) {
    return this.request(path, body)
  }
}

export class SecureShareClient extends PangeaClient {
  orgId?: string
  email?: string

  constructor(
    resolveIssue: boolean = true,
    retries: number = 5,
    exponentialBackoff: number = 0.25,
    protocol: string = "https"
  ) {
    super("share", resolveIssue, retries, exponentialBackoff, protocol)
  }

  scopedClient(orgId: string, email?: string) {
    const clone = Object.create(Object.getPrototypeOf(this))
    Object.assign(clone, this);
    clone.orgId = orgId
    clone.email = email
    return clone
  }

  async getObject(request: ObjectStore.GetRequest): Promise<Response> {
    if (!this.isScoped()) {
      return this.request("/v1beta/get", request)
    }

    const obj = await this.getObj(request.id, request.path)
    if (obj instanceof Response) {
      return obj
    }

    // Could be a download stream
    return this.request("/v1beta/get", request)
  }

  async getObj(
    id?: string,
    path?: string
  ): Promise<PangeaResponse<GetResponse> | Response> {
    const resp = await this.request("/v1beta/get", { id, path })
    if (resp.status !== 200) {
      return resp
    }

    const data: PangeaResponse<GetResponse> = await resp.json()
    if (data.status.toLowerCase() !== "success") {
      return resp
    }

    if (!this.isScoped()) {
      return resp
    }

    // Check if object is the root object
    if (
      data.result.object.name == this.rootPathName() &&
      data.result.object.folder === this.scopedPath(true)
    ) {
      return data
    }

    // Ensure object resides within the scoped path
    const scopedPath = this.scopedPath()
    let folder = data.result.object.folder || "/"
    folder = folder.endsWith("/") ? folder : folder + "/"

    if (!folder.startsWith(scopedPath)) {
      const finalResult = data as unknown as PangeaResponse<null>
      finalResult.result = null
      finalResult.status = "NotFound"
      finalResult.summary = "Resource was not found"
      return new Response(JSON.stringify(finalResult), {
        status: 404,
      })
    }
    // Emulate having a root in the component
    data.result.object.folder = data.result.object!.folder!.slice(
      scopedPath.length - 1
    )
    return data
  }

  async upload(uploadForm: FormData): Promise<Response> {
    if (!this.isScoped()) {
      return this.request("/v1beta/put", uploadForm)
    }

    const requestFile = uploadForm.get("request") as File
    const data = JSON.parse(await requestFile.text())

    const scopedPath = this.scopedPath()
    if (data.path) {
      data.path = `${scopedPath}${data.path}/${data.name}`
    } else {
      data.path = `${scopedPath}${data.name}`
    }
    delete data.name

    uploadForm.set(
      "request",
      new Blob([JSON.stringify(data)], { type: "application/json" })
    )
    const resp = await this.request("/v1beta/put", uploadForm)
    return new Response(resp.body, {
      status: resp.status,
      headers: {
        "Content-Type": resp.headers.get("Content-Type") ?? "application/json",
      },
    })
  }

  async getShareLinks(ids: string[]): Promise<PangeaResponse<LinksResponse>> {
    const body = {
      filter: { id__in: ids } as any,
    }

    if (this.isScoped()) {
      body.filter.tags = this.linkTags()
    }

    const resp = await this.request("/v1beta/share/link/list", body)
    return resp.json()
  }

  async listObjects(request: ObjectStore.ListRequest): Promise<Response> {
    const objs = await this.listObjs(request)
    if(objs instanceof Response) {
      return objs
    }

    return new Response(JSON.stringify(objs), {
      status: 200,
    })
  }

  async listObjs(
    request: ObjectStore.ListRequest,
  ): Promise<PangeaResponse<ListObjectsResponse> | Response> {
    if (!this.isScoped()) {
      const data = await this.request("/v1beta/list", request)
      return data.json()
    }
    const scopedPath = this.scopedPath()

    const filter = request.filter || {}

    if (!filter.id && !filter.parent_id && !filter.folder) {
      filter.folder = scopedPath
    }

    if (filter.folder && !filter.folder.startsWith(scopedPath) && filter.folder != scopedPath) {
      filter.folder = scopedPath.slice(0, -1) + filter.folder
    }

    if (filter.parent_id) {
      const parent = await this.getObj(filter.parent_id)
      if (parent instanceof Response) {
        return parent
      }
    }

    if (filter.id) {
      const folder = await this.getObj(filter.id)
      if (folder instanceof Response) {
        return folder
      }
    }

    if (!request.filter) {
      request.filter = filter
    }
    const resp = await this.request("/v1beta/list", request)
    if (resp.status !== 200) {
      return resp
    }
    const data = (await resp.json()) as PangeaResponse<ListObjectsResponse>
    data.result.objects = data.result.objects.map(
      (obj: Partial<ObjectResponse>) => {
        obj.folder = (obj.folder as string).replace(scopedPath.slice(0, -1), "")
        return obj
      }
    )
    return data
  }

  async deleteObject(request: ObjectStore.DeleteRequest): Promise<Response> {
    if (!this.isScoped()) {
      return this.request("/v1beta/delete", request)
    }
    const resp = await this.getObj(request.id, request.path)
    if (resp instanceof Response) {
      return resp
    }
    return this.request("/v1beta/delete", request)
  }

  async updateObject(request: ObjectStore.UpdateRequest): Promise<Response> {
    if (!this.isScoped()) {
      return this.request("/v1beta/update", request)
    }

    const resp = this.getObj(request.id, request.path)
    if (resp instanceof Response) {
      return resp as Response
    }
    return this.request("/v1beta/update", request)
  }

  async createFolder(
    request: Partial<ObjectStore.FolderCreateRequest>
  ): Promise<Response> {
    if (!this.isScoped()) {
      return this.request("/v1beta/folder/create", request)
    }
    request = { ...request }
    if (request.parent_id) {
      const parent = await this.getObj(request.parent_id, request.path)
      if (parent instanceof Response) {
        return parent
      }
    } else {
      const scopedPath = this.scopedPath()
      request.path
        ? (request.path = `${scopedPath}${request.path}`)
        : (request.path = `${scopedPath}${request.name}`)
      delete request.name
    }
    return this.request("/v1beta/folder/create", request)
  }

  async getLink(request: ObjectStore.ShareGetRequest): Promise<Response> {
    const resp = await this.request("/v1beta/share/link/get", request)
    if (!this.isScoped()) {
      return resp
    }

    if (resp.status != 200) {
      return resp
    }

    const data: any = await resp.json()
    if ((data.status as string).toLowerCase() !== "success") {
      return resp
    }
    const tags = data.tags as string[]
    if (this.hasScopedTags(tags)) {
      data.result = null
      data.status = "NotFound"
      return new Response(JSON.stringify(data), {
        status: 404,
      })
    }
    return new Response(data, {
      status: 200,
    })
  }

  async listLinks(request: ObjectStore.ShareListRequest): Promise<Response> {
    request = { ...request }
    if (this.isScoped()) {
      const filter = request.filter || {}
      filter.tags = filter.tags
        ? [...filter.tags, ...this.linkTags()]
        : this.linkTags()
    }
    return this.request("/v1beta/share/link/list", request)
  }

  async deleteLink(request: ObjectStore.ShareDeleteRequest): Promise<Response> {
    if (!this.isScoped()) {
      return this.request("/v1/share/link/delete", request)
    }
    const linksResp = await this.getShareLinks(request.ids)
    if (linksResp instanceof Response) {
      return linksResp
    }

    const { share_link_objects: links } = linksResp.result
    const foundIds = links.map(({ id }: { id: string }) => id)

    for (let searchedId of request.ids) {
      if (!foundIds.includes(searchedId)) {
        return new Response(JSON.stringify({ status: "NotFound" }), {
          status: 404,
        })
      }
    }
    return this.request("/v1beta/share/link/delete", request)
  }

  async createLink(request: ShareCreateRequest): Promise<Response> {
    request = structuredClone(request)
    if (!this.isScoped()) {
      return this.request("/v1beta/share/link/create", request)
    }

    const objects = new Set<string>()
    for (let link of request.links) {
      link.tags = this.linkTags()
      link.max_access_count = 7

      for (let target of link.targets || []) {
        if (!objects.has(target)) {
          objects.add(target)
        }
      }
    }

    const targets = await this.listObjs({
      filter: {
        id__in: Array.from(objects),
      },
    })

    if (targets instanceof Response) {
      return targets
    }

    if (targets.result.objects.length != objects.size) {
      return new Response(
        JSON.stringify({
          result: null,
          status: "NotFound",
        }),
        {
          status: 404,
        }
      )
    }
    return this.request("/v1beta/share/link/create", request)
  }

  async sendLink(request: ObjectStore.ShareSendRequest): Promise<Response> {
    request = structuredClone(request)
    if (!this.isScoped()) {
      return this.request("/v1beta/share/link/send", request)
    }

    const ids = request.links.map((link) => link.id)
    const linksResp = await this.getShareLinks(ids)

    if (linksResp instanceof Response) {
      return linksResp
    }
    const { share_link_objects: links } = linksResp.result
    if (links.length != ids.length) {
      return new Response(
        JSON.stringify({
          result: null,
          status: "NotFound",
        }),
        {
          status: 404,
        }
      )
    }
    request.sender_email = this.email!
    return this.request("/v1beta/share/link/send", request)
  }

  async proxy(path: string, body: any) {
    return this.request(path, body)
  }

  isScoped(): boolean {
    return Boolean(this.email || this.orgId)
  }

  scopedPath(root: boolean = false): string {
    let path = "/"
    path = this.orgId ? `/${this.orgId}/` : path
    path = this.email ? `${path}${this.email}/` : path

    if (root) {
      return path.split("/").slice(0, -2).join("/")
    }
    return path
  }

  rootPathName(): string {
    const prefixedPath = this.scopedPath()
    return prefixedPath.split("/").slice(-2)[0]
  }

  hasScopedTags(tags: string[]): boolean {
    if (!this.isScoped()) {
      return true
    }
    return this.linkTags().every(tags.includes)
  }

  linkTags(): string[] {
    const tags = []
    if (this.orgId) {
      tags.push(`org:${this.orgId}`)
    }

    if (this.email) {
      tags.push(`owner:${this.email}`)
    }
    return tags
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

enum ObjectType {
  Folder = "folder",
  File = "file",
}

interface ObjectResponse {
  id: string
  name: string
  owner?: string
  created_at: string
  updated_at: string
  parent_id?: string
  folder?: string
  path?: string
  billable_size: number
  size: number
  md5_hex?: string
  sha256_hex?: string
  sha512_hex?: string
  metadata?: Record<string, any>
  tags?: string[]
  type: string | ObjectType
  dest_url?: string

  metadata_protected?: {
    format?: string
    mimetype?: string

    "vault-password-algorithm"?: string
  }

  // Internal from flattenning metadata_protected
  format?: string
  mimetype?: string
  "vault-password-algorithm"?: string
}

interface PangeaResponse<T = any> {
  request_id: string
  status: string
  summary: string
  result: T
}

interface GetResponse {
  dest_url?: string
  object: ObjectResponse
}

interface LinksResponse {
  share_link_objects: {
    id: string
  }[]
}

interface ListObjectsResponse {
  objects: Partial<ObjectResponse>[]
  last?: string
}

interface LinkWithTags extends ObjectStore.SingleShareCreateRequest {
  tags: string[]
}

type ShareCreateRequest = Omit<ObjectStore.ShareCreateRequest, "links"> & {
  links: LinkWithTags[]
}
