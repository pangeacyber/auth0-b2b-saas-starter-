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
        description={
          <>
            Pangea’s Redact service helps developers control sensitive
            information by performing redaction using defined rules. Redact
            comes equipped with out-of-the-box rules to address personally
            identifiable information (PII), geographic locations, payment card
            industry (PCI) data, and many other types of sensitive information,
            while also providing rule customization to fit the needs of your
            application. Protect sensitive information and comply with
            standards, regulations, and legal requirements by using Redact
            throughout your app and on your{" "}
            <a
              className="text-blue-300 underline"
              href="https://pangea.cloud/docs/audit/log-streaming/auth0"
            >
              Auth0 logs streamed to Pangea Secure Audit Log
            </a>
            .
          </>
        }
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
