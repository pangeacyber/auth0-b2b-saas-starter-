import { appClient, managementClient } from "@/lib/auth0"
import { PageHeader } from "@/components/page-header"

import { RedactForm } from "./redact-form"

export default async function RedactPage() {
  const session = await appClient.getSession()
  const { data: org } = await managementClient.organizations.get({
    id: session!.user.org_id,
  })

  return (
    <div className="space-y-2">
      <PageHeader
        title="PII & Sensitive Data Redaction"
        description="Secure your sensitive data with Pangea's Redact service."
      />

      <RedactForm
        organization={{
          id: org.id,
          slug: org.name,
          displayName: org.display_name,
        }}
      />
    </div>
  )
}
