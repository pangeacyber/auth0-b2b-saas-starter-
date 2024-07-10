"use client"

import { useEffect, useMemo, useState } from "react"
import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import ScopedCssBaseline from "@mui/material/ScopedCssBaseline"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { StoreFileViewer } from "@pangeacyber/react-mui-store-file-viewer"

import { StoreCallbackHandler, THEME_OPTIONS } from "@/lib/pangea-utils"

import { PangeaPage } from "../pangea-page"

export default function SecureFileShare() {
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
      serviceName="Secure File Share"
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
      description={
        <>
          If your application needs to securely send or receive documents from
          users, then Pangea Secure Share can help. Pangea’s Secure Share
          service extends your app with a Google Drive-like capability to
          securely send and receive documents and files, and securely manage
          access and sharing. Users can upload files to your app, generate share
          links, and securely send files to others, while managing access by
          number of views and length of time the share link is available. Share
          links are protected with either password authentication, or MFA using
          SMS or One Time Passcodes (OTP) via email.
        </>
      }
      configureLink="https://console.pangea.cloud/service/share"
      documentationLink="https://pangea.cloud/docs/share"
      tickleLink="https://pangea.cloud/docs/api/share/"
      componentTitle="Secure Share Component Example"
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
            <StoreFileViewer apiRef={StoreCallbackHandler} />
          </ScopedCssBaseline>
        </ThemeProvider>
      </CacheProvider>
    </PangeaPage>
  )
}
