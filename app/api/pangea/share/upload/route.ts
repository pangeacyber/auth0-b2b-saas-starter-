import { NextRequest } from "next/server"

import { appClient } from "@/lib/auth0"
import { SecureShareClient } from "@/lib/pangea"

const shareClient = new SecureShareClient()

export const POST = appClient.withApiAuthRequired(async (req: NextRequest) => {
  const formData = await req.formData()
  const resp = await shareClient.upload(formData)
  return new Response(resp.body, {
    status: resp.status,
    headers: {
      "Content-Type": resp.headers.get("Content-Type") ?? "application/json",
    },
  })
})
