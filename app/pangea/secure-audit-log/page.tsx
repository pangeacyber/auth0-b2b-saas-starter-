"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"

export default function SecureAuditLog() {
  return (
    <div className="space-y-2">
      <PageHeader
        title="Secure Audit Log"
        description={
          <>
            A secure audit log is a critical component of any system that
            requires accountability and transparency by providing an accurate
            and secure record of all system events.{" "}
            <a className="underline text-blue-300" href="https://pangea.cloud/docs/audit/log-streaming/auth0">
              Configure Auth0 to stream log events to Pangea Secure Audit Log
            </a>{" "}
            and you will unlock benefits like log retention of up to 10 years,
            hot/warm/cold storage tier configuration to optimize search and
            cost, Redact integration, and tamper-proofing safeguards.
          </>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Audit Log Component Example</CardTitle>
          <CardDescription>
            View the logs associated with this app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <audit-log-viewer id="1"></audit-log-viewer>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end"></CardFooter>
      </Card>
    </div>
  )
}
