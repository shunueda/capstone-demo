import { W3cPresentation } from '@aries-framework/core'

import { JsonLdProofDetailOptions } from './JsonLdProofDetailOptions'

export interface JsonLdProofDetailInputOptions {
  presentation: W3cPresentation
  options: JsonLdProofDetailOptions
}

/**
 * Class providing validation for the V2 json ld proof as per RFC-TBD (used to sign proofs)
 *
 */
export class JsonLdProofDetail {
  public presentation!: W3cPresentation
  public options!: JsonLdProofDetailOptions

  public constructor(options: JsonLdProofDetailInputOptions) {
    if (options) {
      this.presentation = options.presentation
      this.options = options.options
    }
  }
}
