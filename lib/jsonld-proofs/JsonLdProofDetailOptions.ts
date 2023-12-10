export interface JsonLdProofDetailProofStatusOptions {
  type: string
}

export class JsonLdProofDetailProofStatus {
  public type!: string

  public constructor(options: JsonLdProofDetailProofStatusOptions) {
    if (options) {
      this.type = options.type
    }
  }
}

export interface JsonLdProofDetailOptionsOptions {
  proofPurpose: string
  created?: string
  domain?: string
  challenge?: string
  proofStatus?: JsonLdProofDetailProofStatus
  proofType: string
}

export class JsonLdProofDetailOptions {
  public proofPurpose!: string
  public created?: string
  public domain?: string
  public challenge?: string
  public proofType!: string
  public proofStatus?: JsonLdProofDetailProofStatus

  public constructor(options: JsonLdProofDetailOptionsOptions) {
    if (options) {
      this.proofPurpose = options.proofPurpose
      this.created = options.created
      this.domain = options.domain
      this.challenge = options.challenge
      this.proofStatus = options.proofStatus
      this.proofType = options.proofType
    }
  }
}
