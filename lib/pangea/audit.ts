import { PangeaClient } from "./client"
import type { VaultClient } from "./vault"

/**
 * Makes API calls to Pangea's secure audit log service
 *
 * This component mainly serves as a proxy component for the
 * secure audit log component.
 */
export class AuditClient extends PangeaClient {
  /**
   * Paths that the proxy will allow
   */
  proxied_paths = ["/v1/search", "/v1/results", "/v1/root"]

  constructor(
    vaultClient?: VaultClient,
    resolveIssue: boolean = true,
    retries: number = 5,
    exponentialBackoff: number = 0.25,
    protocol: string = "https"
  ) {
    super(
      "audit",
      vaultClient,
      resolveIssue,
      retries,
      exponentialBackoff,
      protocol
    )
  }

  /**
   * Proxies calls from component to secure audit log service
   */
  async proxy(path: string, body: any): Promise<Response> {
    if (!this.proxied_paths.includes(path)) {
      return new Response("Invalid path", {
        status: 404,
      })
    }
    return this.request(path, body)
  }
}
