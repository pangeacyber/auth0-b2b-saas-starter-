import { appClient, managementClient } from "@/lib/auth0"
import { PageHeader } from "@/components/page-header"

import { PangeaPage } from "../pangea-page"
import { RedactForm } from "./redact-form"

export default async function RedactPage() {
  const session = await appClient.getSession()
  const { data: org } = await managementClient.organizations.get({
    id: session!.user.org_id,
  })

  return (
    <PangeaPage
      serviceName="Redact"
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="-mt-1 inline size-8 text-purple-800"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
      }
      description={
        <>
          If your app handles Personally Identifiable Information (PII),
          Pangea’s Redact service helps prevent it’s disclosure by performing
          redaction of over 50 known types of PII. Redact comes equipped with
          out-of-the-box rules to detect PII, geographic locations, payment card
          industry (PCI) data, and many other types of sensitive information,
          while providing rule customization to fit the needs of your app.
          Protect sensitive information and comply with standards, regulations,
          and legal requirements by using Redact throughout your app and on your{" "}
          <a
            className="text-blue-300 underline"
            href="https://pangea.cloud/docs/audit/log-streaming/auth0"
          >
            Auth0 logs streamed to Pangea Secure Audit Log
          </a>
          .
        </>
      }
      configureLink="https://console.pangea.cloud/service/redact"
      documentationLink="https://pangea.cloud/docs/redact"
      tickleLink="https://pangea.cloud/docs/api/redact/"
      componentTitle="PII Redaction Example"
      componentDescription="Type some text then submit to see it redacted."
      overrideCard={
      <RedactForm
        organization={{
          id: org.id,
          slug: org.name,
          displayName: org.display_name,
        }}
      />
      }
    >
    </PangeaPage>
  )
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
