import { PangeaClient } from "./client"
import type { VaultClient } from "./vault"

/**
 * Makes API calls to Pangea's redact service.
 */
export class RedactClient extends PangeaClient {
  constructor(
    vaultClient?: VaultClient,
    resolveIssue: boolean = true,
    retries: number = 5,
    exponentialBackoff: number = 0.25,
    protocol: string = "https"
  ) {
    super(
      "redact",
      vaultClient,
      resolveIssue,
      retries,
      exponentialBackoff,
      protocol
    )
  }

  /**
   * Redact sensitive information from a string based on
   * rules configured at https://console.pangea.cloud/service/redact/rulesets
   */
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
