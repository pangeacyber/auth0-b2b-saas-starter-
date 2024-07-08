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
        description="A secure audit log is a critical component of any system that requires accountability and transparency by providing an accurate and secure record of all system events."
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
