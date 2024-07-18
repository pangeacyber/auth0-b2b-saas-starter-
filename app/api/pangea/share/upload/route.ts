import { NextRequest } from "next/server"

import { appClient } from "@/lib/auth0"
import { SecureShareClient } from "@/lib/pangea"

const shareClient = new SecureShareClient()

export const POST = appClient.withApiAuthRequired(async (req: NextRequest) => {
  const session = await appClient.getSession()
  const orgId = session!.user.org_id
  const email = session!.user.email

  const scopedShareClient = shareClient.scopedClient(orgId, email)
  const formData = await req.formData()
  return scopedShareClient.upload(formData)
})
