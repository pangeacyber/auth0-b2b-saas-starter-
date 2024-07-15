"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import ScopedCssBaseline from "@mui/material/ScopedCssBaseline"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { Audit, AuditLogViewer } from "@pangeacyber/react-mui-audit-log-viewer"

import { THEME_OPTIONS } from "@/lib/pangea-utils"
import { Tabs } from "@/components/ui/tabs"

import { PangeaPage } from "../pangea-page"

const onSearch = (configId?: string) => async (req: Audit.SearchRequest) => {
  const resp = await fetch("/api/pangea/audit", {
    method: "POST",
    body: JSON.stringify({
      path: "/v1/search",
      config_id: configId,
      ...req,
    }),
  })
  const { result } = await resp.json()
  return result
}

const onPageChange =
  (configId?: string) => async (req: Audit.ResultRequest) => {
    const resp = await fetch("/api/pangea/audit", {
      method: "POST",
      body: JSON.stringify({
        path: "/v1/results",
        config_id: configId,
        ...req,
      }),
    })
    const { result } = await resp.json()
    return result
  }

export default function SecureAuditLog() {
  const [matches, setMatches] = useState(true)
  useEffect(() => {
    window
      .matchMedia("(min-width: 1050px)")
      .addEventListener("change", (e) => setMatches(e.matches))
  }, [])

  const cache = useMemo(() => {
    return createCache({ key: "secure-file-share", prepend: true })
  }, [])

  const theme = useMemo(() => {
    return createTheme({
      ...THEME_OPTIONS,
    } as any)
  }, [])

  return (
    <PangeaPage
      serviceName="Secure Audit Log"
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
          Enable your app with an embedded secure audit trail. A critical
          component of any system is accountability and transparency. A secure
          audit trail is essential for logging important security events,
          ranging from authentication and authorization, to medical and
          financial record access.{" "}
          <Link
            className="text-blue-300 underline"
            href="https://pangea.cloud/docs/audit/log-streaming/auth0"
          >
            Extend Auth0’s 30 day log retention by streaming events to Pangea
            Secure Audit Log
          </Link>{" "}
          and you will unlock log retention of up to 10 years, hot/warm/cold
          storage tier configuration to optimize search and cost, Redact
          integration, tamper-proofing safeguards, and an embeddable log viewer
          UI component.
        </>
      }
      configureLink="https://console.pangea.cloud/service/audit"
      documentationLink="https://pangea.cloud/docs/audit"
      tickleLink="https://pangea.cloud/docs/api/audit/"
      componentTitle="Secure Audit Log Component Example"
      componentDescription="A pre-built, customizable component for viewing files and sharing them between users."
      matches={matches}
    >
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <ScopedCssBaseline
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <Tabs
              tabs={[
                {
                  title: "Authentication Events",
                  content: (
                    <AuditLogViewer
                      onSearch={onSearch(
                        process.env.NEXT_PUBLIC_PANGEA_AUDIT_AUTH0_CONFIG_ID
                      )}
                      onPageChange={onPageChange(
                        process.env.NEXT_PUBLIC_PANGEA_AUDIT_AUTH0_CONFIG_ID
                      )}
                    />
                  ),
                },
                {
                  title: "Service Events",
                  content: (
                    <AuditLogViewer
                      onSearch={onSearch(
                        process.env.NEXT_PUBLIC_PANGEA_AUDIT_SERVICES_CONFIG_ID
                      )}
                      onPageChange={onPageChange(
                        process.env.NEXT_PUBLIC_PANGEA_AUDIT_SERVICES_CONFIG_ID
                      )}
                    />
                  ),
                },
              ]}
            />
          </ScopedCssBaseline>
        </ThemeProvider>
      </CacheProvider>
    </PangeaPage>
  )
}
