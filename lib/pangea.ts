export class PangeaClient {
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
    this.resolve202s = resolveIssue
    this.retries = retries
    this.service = service
    this.proto = protocol
    this.exponentialBackoff = exponentialBackoff * 1000
  }

  async request(path: string, body: any) {
    if (!path.startsWith("/")) {
      path = "/" + path
    }
    const resp = await fetch(this.makeUrl(path), {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.PANGEA_TOKEN}` },
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

  async resolve202(location: string) {
    let retries = this.retries
    while (retries > 0) {
      const resp = await fetch(location, {
        method: "GET",
        headers: { Authorization: `Bearer ${process.env.PANGEA_TOKEN}` },
      })

      if (resp.status !== 202) {
        return resp
      }
      const backoff = (this.retries - retries) * this.exponentialBackoff
      await sleep(backoff)
      retries -= 1
    }

    throw new Error("Could not resolve 202 within the given retry window")
  }

  makeUrl(path: string): string {
    const url = `${this.proto}://${this.service}.${process.env.PANGEA_DOMAIN}${path}`
    console.log(url)
    return url
  }
}

export class RedactClient extends PangeaClient {
  constructor(
    resolveIssue: boolean = true,
    retries: number = 5,
    exponentialBackoff: number = 0.25,
    protocol: string = "https"
  ) {
    super("redact", resolveIssue, retries, exponentialBackoff, protocol)
  }

  async text(text: string): Promise<string> {
    const resp = await this.request("/v1/redact", { text })
    if (resp.status != 200) {
      console.error(await resp.text())
      throw new Error("Failed to call redact service")
    }
    const {
      result: { redacted_text },
    } = await resp.json()
    return redacted_text
  }
}

export class AuditClient extends PangeaClient {
  constructor(
    resolveIssue: boolean = true,
    retries: number = 5,
    exponentialBackoff: number = 0.25,
    protocol: string = "https"
  ) {
    super("audit", resolveIssue, retries, exponentialBackoff, protocol)
  }

  async proxy(path: string, body: any) {
    return this.request(path, body)
  }
}

export class SecureShareClient extends PangeaClient {
  constructor(
    resolveIssue: boolean = true,
    retries: number = 5,
    exponentialBackoff: number = 0.25,
    protocol: string = "https"
  ) {
    super("share", resolveIssue, retries, exponentialBackoff, protocol)
  }

  async upload(uploadForm: FormData) {
    return this.request("/v1beta/put", uploadForm)
  }

  async proxy(path: string, body: any) {
    return this.request(path, body)
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
