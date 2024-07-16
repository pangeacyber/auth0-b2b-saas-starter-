import { NextRequest } from "next/server"

import { appClient } from "@/lib/auth0"
import { SecureShareClient } from "@/lib/pangea"

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
  const scopedShareClient = shareClient.scopedClient(orgId, email)

  switch (action) {
    case "/v1beta/get":
      return scopedShareClient.getObject(body)

    case "/v1beta/list":
      return scopedShareClient.listObjects(body)

    case "/v1beta/delete":
      return scopedShareClient.deleteObject(body)

    case "/v1beta/update":
      return scopedShareClient.updateObject(body)

    case "/v1beta/folder/create":
      return scopedShareClient.createFolder(body)

    case "/v1beta/share/link/list":
      return scopedShareClient.listLinks(body)

    case "/v1beta/share/link/get":
      return scopedShareClient.getLink(body)

    case "/v1beta/share/link/delete":
      return scopedShareClient.deleteLink(body)

    case "/v1beta/share/link/create":
      return scopedShareClient.createLink(body)

    case "/v1beta/share/link/send":
      return scopedShareClient.sendLink(body)

    default:
      throw new Error(`Action ${action} is not implemented or does not exist`)
  }
}
