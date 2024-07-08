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
        description="The whole kitchen sink of security."
      />
      <div className="pl-6 pr-6">
        <p className="text-muted-foreground">
          You can configure Pangea services to use in your SAAS application. The
          menu on the left provides some sample usecases for your app.
        </p>
        <div className="mt-3">
          <Link href="https://pangea.cloud">
            <Button className="bg-purple-800">
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
        description="
          A secure audit log is a critical component of any system that requires accountability and transparency by providing an accurate and secure record of all system events.
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
        description="
        Pangea’s Secure Share service is a file system that provides protected data storage for files and folders, as well as the ability to securely manage access and sharing. Organizations can upload files to Pangea, generate shareable links, and choose to allow users to upload, download, or edit their files while managing access by number of views and length of time the URL is available. Shares can even require password authentication, or utilize One Time Passcodes (OTP) via email or SMS to prevent unauthorized access.
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
        description="
            Pangea’s Redact service helps developers control sensitive
            information by performing redaction using defined rules. Redact
            comes equipped with out-of-the-box rules to address personally
            identifiable information (PII), geographic locations, payment card
            industry (PCI) data, and many other types of sensitive information,
            while also providing rule customization to fit the needs of your
            application."
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
    </div>
  )
}

interface ServiceEntryProps {
  name: string
  description: string
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
        <div className="mt-3">
          <Link href={props.settingsLink} className="">
            <Button className="bg-purple-800">Configure {props.name}</Button>
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
