import { NextRequest, NextResponse } from "next/server"
import { appClient } from "@/lib/auth0"

import { SecureShareClient } from "@/lib/pangea"

const shareClient = new SecureShareClient()

interface Data {
  path: string
}

export const POST = appClient.withApiAuthRequired(async (req: NextRequest) => {
  const body = (await req.json()) as Data

  const { path: action, ...params } = body

  if (!body.path) {
    return NextResponse.json(
      { error: "'path' field is required" },
      { status: 400 }
    )
  }

  if (typeof body.path !== "string") {
    return NextResponse.json(
      { error: "'path' field must be a string" },
      { status: 400 }
    )
  }

  const resp = await shareClient.proxy(body.path, params)
  return new Response(resp.body, {
    status: resp.status,
    headers: {
      "Content-Type": resp.headers.get("Content-Type") ?? "application/json",
    },
  })
})
