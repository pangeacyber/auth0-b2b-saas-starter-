import Link from "next/link"

import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"

export default async function PangeaDemo() {
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
      </div>
    </div>
  )
}
