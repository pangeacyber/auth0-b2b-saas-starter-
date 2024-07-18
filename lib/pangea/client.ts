import { PangeaHTTPClient, PangeaResponse } from "./http_client"
import { defaultVaultClient, VaultClient } from "./vault"

/**
 * Makes HTTP calls to Pangea using a service token
 * fetched from Pangea's vault service.
 */
export class PangeaClient extends PangeaHTTPClient {
  vaultClient: VaultClient

  constructor(
    serviceName: string,
    vaultClient?: VaultClient,
    resolveIssue: boolean = true,
    retries: number = 5,
    exponentialBackoff: number = 0.25,
    protocol: string = "https"
  ) {
    super(serviceName, resolveIssue, retries, exponentialBackoff, protocol)
    this.vaultClient = vaultClient ? vaultClient : defaultVaultClient
  }

  async getToken(): Promise<string> {
    return await this.vaultClient.fetchServiceToken(
      process.env.PANGEA_SERVICE_TOKEN_ID!
    )
  }
}

export type { PangeaResponse }
