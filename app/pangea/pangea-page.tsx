"use client"

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
import { useLayoutEffect, useRef, useState } from "react";

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

interface PangeaPageProps {
  serviceName: string
  icon: React.ReactNode
  description: React.ReactNode
  configureLink: string
  documentationLink: string
  tickleLink: string
  componentTitle: string
  componentDescription: string
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
  footer,
  overrideCard,
  children,
}: PangeaPageProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useWindowSize();

  return (
    <div
      className="space-y-2"
      style={{
        width: "100%",
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
              <Link href={configureLink} target="_blank">
                <Button className="bg-purple-800 dark:text-white">
                  Configure {serviceName}
                </Button>
              </Link>
              <Link href={documentationLink} className="pl-2" target="_blank">
                <Button variant="secondary">Documentation</Button>
              </Link>
              <Link href={tickleLink} className="pl-2" target="_blank">
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
            <div ref={ref} style={{ width: "100%" }}>
              <div
                style={{
                  width: `${ref.current?.clientWidth ?? 0}px`,
                }}
              >
                {children}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">{footer}</CardFooter>
        </Card>
      )}
    </div>
  )
}
