"use client";

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
  const [sent, setSent] = useState(false)

  return (
    <Card>
      <form
        onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          const text = (
            e.currentTarget.elements.namedItem("targetText") as HTMLInputElement
          ).value
          console.log(text)
          const resp = await fetch("/api/pangea/redact", {
            method: "POST",
            body: JSON.stringify({ message: text }),
          })
          const { message } = await resp.json()
          setSent(true)
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
              defaultValue={`An example of simple text redaction:
My email is admin@pangea-cyber-1.com

An example of format preserving encryption:
My phone number is (555)-555-5555

An example of salted hash:
My SSN is 123-54-7890

An example of prefix:
My Credit Card number is 4917-4845-8989-7107`}
              rows={12}
            />
          </div>
          {sent && (
            <h3 className="font-semibold leading-none tracking-tight">
              Redacted Text:
            </h3>
          )}
          <div className="grid w-full max-w-sm items-center gap-2">
          <Textarea
              className="text-sm text-muted-foreground"
              disabled
              value={text}
              rows={12}
            />
            </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <SubmitButton>submit</SubmitButton>
        </CardFooter>
      </form>
    </Card>
  )
}
