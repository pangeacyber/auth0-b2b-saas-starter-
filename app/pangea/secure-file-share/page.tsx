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
        description={
          <>
            Pangea’s Secure Share service is a file system that provides
            protected data storage for files and folders, as well as the ability
            to securely manage access and sharing. Organizations can upload
            files to Pangea, generate shareable links, and choose to allow users
            to upload, download, or edit their files while managing access by
            number of views and length of time the URL is available. Shares can
            even require password authentication, or utilize One Time Passcodes
            (OTP) via email or SMS to prevent unauthorized access.
          </>
        }
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
