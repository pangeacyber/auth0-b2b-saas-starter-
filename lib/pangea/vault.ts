import { PangeaHTTPClient } from "./http_client"

/**
 * Makes API calls to Pangea's vault service.
 *
 * This client includes a cache
 */
export class VaultClient extends PangeaHTTPClient {
  tokenCache: TokenCache
  constructor(
    tokenCache?: TokenCache,
    resolveIssue: boolean = true,
    retries: number = 5,
    exponentialBackoff: number = 0.25,
    protocol: string = "https"
  ) {
    super("vault", resolveIssue, retries, exponentialBackoff, protocol)
    this.tokenCache = tokenCache ? tokenCache : new Map<string, string>()
  }

  async getToken(): Promise<string> {
    return process.env.PANGEA_TOKEN!
  }

  async fetchServiceToken(serviceTokenId: string): Promise<string> {
    const cachedToken = this.tokenCache.get(serviceTokenId)
    if (cachedToken) {
      return cachedToken
    }

    const resp = await this.request("/v1/get", { id: serviceTokenId })
    if (resp.status != 200) {
      const text = await resp.text()
      throw new Error(`Failed to fetch vault token: ${text}`)
    }

    const {
      result: {
        current_version: { secret: token },
      },
    } = await resp.json()
    this.tokenCache.set(serviceTokenId, token)
    return token
  }
}

/**
 * Default vault client used by the rest of the application.
 *
 * Uses default cache since next.js api functions will only be warm
 * for a short period of time, so no TTL is needed.
 */
export const defaultVaultClient = new VaultClient()

/**
 * Interface for cache used by vault client
 */
export interface TokenCache {
  get(key: string): string | undefined
  set(key: string, token: string): this
}
