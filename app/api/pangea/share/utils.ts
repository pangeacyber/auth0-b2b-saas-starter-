
interface PangeaResponse<T = any> {
  request_id: string
  status: string
  summary: string
  result: T
}

export interface LinksResponse {
  share_link_objects: {
    id: string
  }[]
}

export async function getShareLinks(
  orgId: string,
  email: string,
  ids: string[]
): Promise<PangeaResponse<LinksResponse>> {
  const url = `https://share.${process.env.PANGEA_DOMAIN}/v1beta/share/link/list`
  const body = {
    filter: { id__in: ids, tags: linkTags(orgId, email) },
  }
  const resp = await performFetch(url, body)
  return await resp.json()
}

export enum ObjectType {
  Folder = "folder",
  File = "file",
}

export interface ObjectResponse {
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

export interface GetResponse {
  dest_url?: string
  object: ObjectResponse
}

export async function getObject(
  email: string,
  orgId: string,
  id?: string,
  path?: string
): Promise<PangeaResponse<GetResponse> | Response> {
  const url = `https://share.${process.env.PANGEA_DOMAIN}/v1beta/get`

  const resp = await performFetch(url, { id, path })
  if (resp.status < 200 || resp.status > 299) {
    return resp
  }

  const data: PangeaResponse<GetResponse> = await resp.json()
  if (data.status.toLowerCase() !== "success") {
    return resp
  }

  if (data.result.object.name === email && data.result.object.folder === "/") {
    return resp
  }

  const [_, orgPart, emailPart] = (data.result.object.folder || "/").split("/")
  if (orgPart !== orgId || emailPart != email) {
    const d = data as unknown as PangeaResponse<null>
    d.result = null
    d.status = "NotFound"
    d.summary = "Resource was not found"
    return new Response(JSON.stringify(d), {
      status: 404,
    })
  }

  data.result.object.folder = data.result.object?.folder?.slice(
    orgId.length + email.length + 2
  )
  return data
}

export async function performFetch(url: string, body: any) {
  const resp = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${process.env.PANGEA_TOKEN}`,
    },
  })
  return new Response(resp.body, {
    status: resp.status,
    headers: {
      "Content-Type": resp.headers.get("Content-Type") ?? "application/json",
    },
  })
}

export async function log(
  action: string,
  actor: string,
  source: string,
  message: string
): Promise<Response> {
  const url = `https://audit.${process.env.PANGEA_DOMAIN}/v1/log`
  const body = {
    config_id: process.env.PANGEA_AUDIT_CONFIG_ID,
    event: {
      action: action.toLowerCase(),
      service_feature: "user_activity",
      message,
      service_name: "Share",
      status: "Success",
      source,
      actor,
      timestamp: new Date(),
    },
  }
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${process.env.PANGEA_TOKEN}`,
    },
  })
}

export function tagsMatch(orgId: string, email: string, tags: string[]): boolean {
  return linkTags(orgId, email).every(tags.includes)
}

export function linkTags(orgId: string, email: string): string[] {
  return [`owner:${email}`, `org:${orgId}`]
}
