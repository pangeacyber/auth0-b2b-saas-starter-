import { NextRequest } from "next/server"
import { appClient } from "@/lib/auth0"
import { SecureShareClient } from "@/lib/pangea"

import { getObject } from "../route"

const shareClient = new SecureShareClient()

export const POST = appClient.withApiAuthRequired(async (req: NextRequest) => {
  const session = await appClient.getSession()
  const orgId = session!.user.org_id
  const email = session!.user.email
  const formData = await req.formData()
  const requestFile = formData.get("request") as File
  const data = JSON.parse(await requestFile.text())
  const name = data.name

  if (data.path) {
    data.path = data.path
      ? `/${orgId}/${email}/${data.path}/${name}`
      : `/${orgId}/${email}/${name}`
    delete data.name
  } else if (data.parent_id) {
    const resp = await getObject(email, orgId, data.parent_id)
    if (resp instanceof Response) {
      return resp
    }
  } else {
    data.path = `/${orgId}/${email}/${name}`
    delete data.name
  }

  formData.set(
    "request",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  )

  const resp = await shareClient.upload(formData)
  return new Response(resp.body, {
    status: resp.status,
    headers: {
      "Content-Type": resp.headers.get("Content-Type") ?? "application/json",
    },
  })
})
