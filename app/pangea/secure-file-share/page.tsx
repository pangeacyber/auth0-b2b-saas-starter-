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

export default function SecureFileShare() {
  return (
    <div className="space-y-2">
      <PageHeader
        title="Secure File Share"
        description="Pangea’s Secure Share service is a file system that provides protected data storage for files and folders, as well as the ability to securely manage access and sharing."
      />

      <Card>
        <CardHeader>
          <CardTitle>Secure File Share Component Example</CardTitle>
          <CardDescription>
            A pre-built, customizable component for viewing files and sharing
            them between users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <store-file-viewer id="1"></store-file-viewer>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end"></CardFooter>
      </Card>
    </div>
  )
}
