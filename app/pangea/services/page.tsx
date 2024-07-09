import Link from "next/link"

import { appClient, managementClient } from "@/lib/auth0"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"

export default async function PangeaDemo() {
  const session = await appClient.getSession()
  const { data: org } = await managementClient.organizations.get({
    id: session!.user.org_id,
  })

  return (
    <div className="space-y-2">
      <PageHeader
        title="Pangea Services"
        description="After enabling your app with Auth0, you can extend it with over 17 additional security features to deliver an even more secure user experience. Pangea services extend the security of your SaaS application with audit logging, secure document sharing, PII redaction, and much more. The menu on the left provides some sample use cases for your app."
      />
      <div className="pl-6 pr-6">
        <div>
          <Link href="https://pangea.cloud">
            <Button className="bg-purple-800 dark:text-white">
              Sign up for a Pangea account
            </Button>
          </Link>
          <Link href="https://pangea.cloud/docs#everything-a-builder-needs-united">
            <Button className="ml-2" variant="secondary">
              Learn more about Pangea Services
            </Button>
          </Link>
        </div>
        <hr className="mt-6" />
      </div>
      <ServiceEntry
        name="Secure Audit Log"
        description={
          <>
            Enable your app with an embedded secure audit trail. A critical
            component of any system is accountability and transparency. A secure
            audit trail is essential for logging important security events,
            ranging from authentication and authorization, to medical and
            financial record access.{" "}
            <a className="underline text-blue-300" href="https://pangea.cloud/docs/audit/log-streaming/auth0">
              Extend Auth0’s 30 day log retention by streaming events to Pangea
              Secure Audit Log
            </a>{" "}
            and you will unlock log retention of up to 10 years, hot/warm/cold
            storage tier configuration to optimize search and cost, Redact
            integration, tamper-proofing safeguards, and an embeddable log
            viewer UI component.
          </>
        }
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
              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
        }
        settingsLink="https://console.pangea.cloud/service/audit"
        documentationLink="https://pangea.cloud/docs/audit"
        tickleLink="https://pangea.cloud/docs/api/audit/"
      />
      <ServiceEntry
        name="Secure Share"
        description="If your application needs to securely send or receive documents from users, then Pangea Secure Share can help. Pangea’s Secure Share service extends your app with a Google Drive-like capability to securely send and receive documents and files, and securely manage access and sharing. Users can upload files to your app, generate share links, and securely send files to others, while managing access by number of views and length of time the share link is available. Share links are protected with either password authentication, or MFA using SMS or One Time Passcodes (OTP) via email."
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
              d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
            />
          </svg>
        }
        settingsLink="https://console.pangea.cloud/service/share"
        documentationLink="https://pangea.cloud/docs/share"
        tickleLink="https://pangea.cloud/docs/api/share/"
      />
      <ServiceEntry
        name="Redact"
        description={
          <>
        If your app handles Personally Identifiable Information (PII), Pangea’s Redact service helps prevent it’s disclosure by performing redaction of over 50 known types of PII. Redact comes equipped with out-of-the-box rules to detect PII, geographic locations, payment card industry (PCI) data, and many other types of sensitive information, while providing rule customization to fit the needs of your app.  Protect sensitive information and comply with standards, regulations, and legal requirements by using Redact throughout your app and on your <a className="underline text-blue-300" href="https://pangea.cloud/docs/audit/log-streaming/auth0">Auth0 logs streamed to Pangea Secure Audit Log</a>.
            </>
        }
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
        settingsLink="https://console.pangea.cloud/service/redact"
        documentationLink="https://pangea.cloud/docs/redact"
        tickleLink="https://pangea.cloud/docs/api/redact/"
      />
      {/*
      <ServiceEntry
        name="Sanitize"
        description="
        Pangea’s Sanitize service allows you to analyze and clean potentially harmful files, removing any actionable or potentially harmful content and links. In addition to customization options for content removal, your Pangea User Console also offers the ability to sync with our other services such as Secure Share for enhanced file security.
            "
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
              d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
            />
          </svg>
        }
        settingsLink="https://console.pangea.cloud/service/sanitize"
        documentationLink="https://pangea.cloud/docs/sanitize"
        tickleLink="https://pangea.cloud/docs/api/sanitize/"
      />
     */}
    </div>
  )
}

interface ServiceEntryProps {
  name: string
  description: React.ReactNode
  icon: React.ReactNode
  settingsLink: string
  documentationLink: string
  tickleLink: string
}

function ServiceEntry(props: ServiceEntryProps) {
  return (
    <div className="flex flex-col gap-1 p-6">
      <div>
        <p className="text-2xl font-semibold">
          {props.icon}
          &nbsp;
          {props.name}
        </p>
        <p className="mt-2 text-muted-foreground">{props.description}</p>
        <div className="mt-7">
          <Link href={props.settingsLink} className="">
            <Button className="bg-purple-800 dark:text-white">
              Configure {props.name}
            </Button>
          </Link>
          <Link href={props.documentationLink} className="pl-2">
            <Button variant="secondary">Documentation</Button>
          </Link>
          <Link href={props.tickleLink} className="pl-2">
            <Button variant="outline">Try It</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
