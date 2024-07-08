import { appClient, managementClient } from "@/lib/auth0"
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
        description=""
      />
      <p>foorbarius</p>
    </div>
  )
}
