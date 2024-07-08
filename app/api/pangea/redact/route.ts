import { NextRequest, NextResponse } from "next/server"

import { RedactClient } from "@/lib/pangea"
import { appClient } from "@/lib/auth0"

const redactClient = new RedactClient()

type Data = {
  message: string
}

export const POST = appClient.withApiAuthRequired(async (req: NextRequest) => {
  const body = (await req.json()) as Data
  if (!body.message) {
    return NextResponse.json(
      { error: "Message field is required" },
      { status: 400 }
    )
  }

  if (typeof body.message !== "string") {
    return NextResponse.json(
      { error: "Message field must be a string" },
      { status: 400 }
    )
  }

  const redactedText = await redactClient.text(body.message)
  return NextResponse.json({ message: redactedText })
});
