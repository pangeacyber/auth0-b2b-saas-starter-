import { sleep } from "./utils"

/**
 * Pangea's HTTP Response body type
 */
export interface PangeaResponse<T = any> {
  request_id: string
  status: string
  summary: string
  result: T
}

/**
 * Makes HTTP calls to Pangea cloud
 */
export class PangeaHTTPClient {
  resolve202s: boolean
  retries: number
  service: string
  proto: string
  exponentialBackoff: number

  constructor(
    service: string,
    resolveIssue: boolean = true,
    retries: number = 5,
    exponentialBackoff: number = 0.25,
    protocol: string = "https"
  ) {
    this.service = service
    this.resolve202s = resolveIssue
    this.retries = retries
    this.proto = protocol
    this.exponentialBackoff = exponentialBackoff * 1000
  }

  /**
   * Make an HTTP request using a path and body.
   * The host information is derived from makeUrl, only the path
   * need be passed eg. /v1/redact
   */
  async request(path: string, body: any): Promise<Response> {
    if (!path.startsWith("/")) {
      path = "/" + path
    }

    const token = await this.getToken()
    const resp = await fetch(this.makeUrl(path), {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: body instanceof FormData ? body : JSON.stringify(body),
    })

    if (this.resolve202s && resp.status === 202) {
      const {
        result: { location },
      } = await resp.json()
      return this.resolve202(location)
    }
    return resp
  }

  /**
   * Implemented by classes extending PangeaHTTPClient, each
   * client can provide its token in a different way making
   * it more extensible
   */
  async getToken(): Promise<string> {
    throw new Error("Not implemented!")
  }

  /**
   * Some pangea APIs, specifically audit and share apis can 202
   * if the operation takes longer (cold search, large file scans), this function
   * resolves the 202 for the underlying client.
   *
   * The location parameter comes from the 202 response
   */
  async resolve202(location: string) {
    const token = await this.getToken()
    let retries = this.retries
    while (retries > 0) {
      const resp = await fetch(location, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (resp.status !== 202) {
        return resp
      }
      // Exponential backoff for retries
      const backoff = (this.retries - retries) * this.exponentialBackoff
      await sleep(backoff)
      retries -= 1
    }

    throw new Error("Could not resolve 202 within the given retry window")
  }

  // Private

  makeUrl(path: string): string {
    const url = `${this.proto}://${this.service}.${process.env.PANGEA_DOMAIN}${path}`
    return url
  }
}
