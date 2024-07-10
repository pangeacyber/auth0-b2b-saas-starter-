import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"

interface PangeaPageProps {
  serviceName: string
  icon: React.ReactNode
  description: React.ReactNode
  configureLink: string
  documentationLink: string
  tickleLink: string
  componentTitle: string
  componentDescription: string
  matches?: boolean
  footer?: React.ReactNode
  overrideCard?: React.ReactNode
  children?: React.ReactNode
}

export const PangeaPage = ({
  serviceName,
  icon,
  description,
  configureLink,
  documentationLink,
  tickleLink,
  componentTitle,
  componentDescription,
  matches,
  footer,
  overrideCard,
  children,
}: PangeaPageProps) => {
  return (
    <div
      className="space-y-2"
      style={{
        // @ts-ignore
        ".Pangea-Flyout-Container": {
          backgroundColor: "hsl(var(--foreground))!important",
        },
      }}
    >
      <PageHeader
        title={
          <>
            {icon} {serviceName}
          </>
        }
        description={
          <>
            {description}
            <div className="mt-7">
              <Link href={configureLink}>
                <Button className="bg-purple-800 dark:text-white">
                  Configure {serviceName}
                </Button>
              </Link>
              <Link href={documentationLink} className="pl-2">
                <Button variant="secondary">Documentation</Button>
              </Link>
              <Link href={tickleLink} className="pl-2">
                <Button variant="outline">Try It</Button>
              </Link>
            </div>
          </>
        }
      />
      {overrideCard ? (
        overrideCard
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{componentTitle}</CardTitle>
            <CardDescription>{componentDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              style={
                matches !== undefined
                  ? {
                      width: `calc(100vw - ${matches ? "350px" : "100px"})`,
                      maxWidth: "100%",
                    }
                  : {}
              }
            >
              {children}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">{footer}</CardFooter>
        </Card>
      )}
    </div>
  )
}
