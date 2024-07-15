import { NextRequest } from "next/server"

import { appClient } from "@/lib/auth0"
import { SecureShareClient } from "@/lib/pangea"
import { getShareLinks, getObject, performFetch, linkTags, tagsMatch } from "./utils"

const shareClient = new SecureShareClient()

interface Data {
  path: string
  params: { [key: string]: any }
}

export const POST = appClient.withApiAuthRequired(async function (
  req: NextRequest
) {
  const session = await appClient.getSession()
  const orgId = session!.user.org_id
  const email = session!.user.email
  const { path, params } = (await req.json()) as Data
  return fetchStore(orgId, email, path, params)
})

async function fetchStore(
  orgId: string,
  email: string,
  action: string,
  body: any
): Promise<Response> {
  let auditAction: null | string = null
  let auditActor: null | string = null
  let auditMessage: null | string = null

  const rootFolder = `/${orgId}/${email}`
  switch (action) {
    case "/v1beta/get": {
      const objectResp = await getObject(email, orgId, body.id, body.path)
      if (objectResp instanceof Response) {
        return objectResp as Response
      }

      const folder = objectResp.result.object.folder
      objectResp.result.object.folder = (folder as string).replace(
        `/${orgId}/${email}`,
        ""
      )
      if (body.transfer_method) {
        auditAction = "Downloaded File"
        auditActor = email
        auditMessage = `${email} downloaded ${body.id || body.path}`
      } else {
        return new Response(JSON.stringify(objectResp), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        })
      }
    }
    break;
    case "/v1beta/list": {
      // If a filter is not present, or the filter folder does not start with email
      if (body.filter && body.filter.parent_id) {
        const parent = await getObject(email, orgId, body.filter.parent_id)
        if (parent instanceof Response) {
          return parent
        }
      }

      if (body.filter && body.filter.id) {
        const folder = await getObject(email, orgId, body.filter.id)
        if (folder instanceof Response) {
          return folder
        }
      }

      if (
        body.filter &&
        body.filter.folder &&
        !(body.filter.folder as string).startsWith(rootFolder)
      ) {
        body.filter.folder = rootFolder + body.filter.folder
      }

      if (
        !body.filter ||
        (!body.filter.id && !body.filter.parent_id && !body.filter.folder)
      ) {
        body.filter = {}
        body.filter.folder = rootFolder
      }

      const url = `https://share.${process.env.PANGEA_DOMAIN}${action}`
      const resp = await performFetch(url, body)
      if (resp.status !== 200) {
        return resp
      }
      const data: any = await resp.json()
      data.result.objects = data.result.objects.map((o: any) => {
        o.folder = (o.folder as string).replace(`/${orgId}/${email}`, "")
        return o
      })
      return new Response(JSON.stringify(data), {
        status: resp.status,
      })
    }
    case "/v1beta/delete":
      {
        const resp = await getObject(email, orgId, body.id, body.path)
        if (resp instanceof Response) {
          return resp as Response
        }
        auditAction =
          resp.result.object.type === "folder"
            ? "Folder Deleted"
            : "File Deleted"
        auditActor = email
        auditMessage = `${email} deleted ${body.id || body.path}`
      }
      break
    case "/v1beta/update":
      {
        const resp = await getObject(email, orgId, body.id, body.path)
        if (resp instanceof Response) {
          return resp as Response
        }
        auditAction =
          resp.result.object.type === "folder"
            ? "Folder Updated"
            : "File Updated"
        auditActor = email
        auditMessage = `${email} updated ${body.id || body.path}`
      }
      break
    case "/v1beta/folder/create":
      if (body.parent_id) {
        const parent = await getObject(email, orgId, body.parent_id, body.path)
        if (parent instanceof Response) {
          return parent
        }
      } else {
        body.path
          ? (body.path = `${rootFolder}/${body.path}`)
          : (body.path = `${rootFolder}/${body.name}`)
      }
      delete body.name;
      auditAction = "Folder Created"
      auditActor = email
      auditMessage = `${email} created folder ${body.path}`
      break
    case "/v1beta/share/link/list":
      {
        const filter = body.filter || {}
        filter.tags = linkTags(orgId, email)
        body.filter = filter
      }
      break
    case "/v1beta/share/link/get": {
      const url = `https://share.${process.env.PANGEA_DOMAIN}/v1beta/share/link/get`
      const resp = await performFetch(url, body)
      if (resp.status !== 200) {
        return resp
      }

      const data: any = await resp.json()
      if ((data.status as string).toLowerCase() !== "success") {
        return resp
      }

      const tags = data.tags as string[]
      if (tagsMatch(orgId, email, tags)) {
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
    case "/v1beta/share/link/delete":
      {
        const linksResp = await getShareLinks(orgId, email, body.ids)
        const links = linksResp.result.share_link_objects.reduce(
          (acc, o) => acc.add(o.id),
          new Set()
        )
        // Make sure delete ids belong to this owner
        for (let id of body.ids) {
          if (!links.has(id)) {
            return new Response(JSON.stringify({ status: "NotFound" }), {
              status: 404,
            })
          }
        }
        auditAction = "Share Link Deleted"
        auditActor = email
        auditMessage = `${email} deleted share link ${body.ids[0]}`
      }
      break
    case "/v1beta/share/link/create":
      {
        for (let link of body.links) {
          link.tags = linkTags(orgId, email)
          link.max_access_count = 7
          const targets = await Promise.all(
            link.targets.map((t: any) => getObject(email, orgId, t))
          )
          // Targets that don't exist should be included
          for (let target of targets) {
            if (target instanceof Response) {
              return target
            }
          }
          auditAction = "Share Link Created"
          auditActor = email
          auditMessage = `${email} created a share link`
        }
      }
      break
    case "/v1beta/share/link/send":
      {
        body.sender_email = email
        const referencedLinks = body.links.map((l: any) => l.id)
        const referencedEmails = body.links.map((l: any) => l.email)

        const linksResp = await getShareLinks(orgId, email, referencedLinks)
        const links = linksResp.result.share_link_objects.reduce(
          (acc, o) => acc.add(o.id),
          new Set()
        )
        // Make sure delete ids belong to this owner
        for (let { id } of body.links) {
          if (!links.has(id)) {
            return new Response(JSON.stringify({ status: "NotFound" }), {
              status: 404,
            })
          }
        }
        auditAction = "Share Link Sent"
        auditActor = referencedEmails[0]
        auditMessage = `${email} sent a share link to ${referencedEmails[0]}`
      }
      break
    default:
      throw new Error(`Action ${action} is not implemented or does not exist`)
  }
  const url = `https://share.${process.env.PANGEA_DOMAIN}${action}`
  const resp = await performFetch(url, body)
  if (
    !auditAction ||
    !auditActor ||
    !auditMessage ||
    resp.status < 200 ||
    resp.status > 299
  ) {
    return resp
  }

  // await log(auditAction, auditActor, email, auditMessage)
  return resp
}
