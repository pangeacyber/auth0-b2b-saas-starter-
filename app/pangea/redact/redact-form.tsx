"use client"

import React, { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { SubmitButton } from "@/components/submit-button"

interface Props {
  organization: {
    id: string
    displayName: string
    slug: string
  }
}

export function RedactForm({ organization }: Props) {
  const [text, setText] = useState("Redacted text will show up here.")
  const [sent, setSent] = useState(false);

  return (
    <Card>
      <form
        onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          const text = (
            e.currentTarget.elements.namedItem("targetText") as HTMLInputElement
          ).value
          console.log(text);
          const resp = await fetch("/api/pangea/redact", {
            method: "POST",
            body: JSON.stringify({ message: text }),
          })
          const { message } = await resp.json()
          setSent(true);
          setText(message)
        }}
      >
        <CardHeader>
          <CardTitle>PII Redaction Example</CardTitle>
          <CardDescription>
            Type some text then submit to see it redacted.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid w-full max-w-sm items-center gap-2">
            <Textarea
              id="targetText"
              name="targetText"
              defaultValue={`My email is admin@${organization.slug}.com, phone number is (555)-555-5555.`}
              rows={10}
            />
          </div>
          { sent && <h3 className="font-semibold leading-none tracking-tight">Redacted Text:</h3> }
          <p className="text-sm text-muted-foreground">{text}</p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <SubmitButton>submit</SubmitButton>
        </CardFooter>
      </form>
    </Card>
  )
}
