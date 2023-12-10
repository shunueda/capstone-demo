import { AskarModule } from '@aries-framework/askar'
import {
  Agent,
  Buffer,
  ConnectionsModule,
  ConsoleLogger,
  CredentialsModule,
  DidsModule,
  HttpOutboundTransport,
  InitConfig,
  JsonLdCredentialFormatService,
  LogLevel,
  ProofsModule,
  V2CredentialProtocol,
  V2ProofProtocol,
  WsOutboundTransport
} from '@aries-framework/core'
import { agentDependencies, HttpInboundTransport } from '@aries-framework/node'
import { ariesAskar } from '@hyperledger/aries-askar-nodejs'
import {
  OracleDidRegistrar,
  OracleDidResolver,
  OracleModule,
  OracleModuleConfig
} from '@lehigh-oracle-did23/aries-framework-oracle'
import { JsonLdProofFormatService } from '@/lib/jsonld-proofs/JsonLdProofFormatService'

// Simple agent configuration. This sets some basic fields like the wallet
// configuration and the label. It also sets the mediator invitation url,
// because this is most likely required in a mobile environment.
const config: InitConfig = {
  label: 'demo-agent-holder',
  walletConfig: {
    id: 'mainHolder',
    key: 'demoagentholder00000000000000000000'
  },
  logger: new ConsoleLogger(LogLevel.info),
  endpoints: ['http://localhost:3001']
}

// A new instance of an agent is created here
// Askar can also be replaced by the indy-sdk if required
export const holder = new Agent({
  config,
  modules: {
    askar: new AskarModule({ ariesAskar }),
    connections: new ConnectionsModule({ autoAcceptConnections: true }),
    dids: new DidsModule({
      registrars: [new OracleDidRegistrar()],
      resolvers: [new OracleDidResolver()]
    }),
    oracle: new OracleModule(
      new OracleModuleConfig({
        networkConfig: {
          network: `${process.env.BC_URL}`,
          channel: `${process.env.BC_CHANNEL}`,
          chaincode: `${process.env.BC_DID_CHAINCODE_NAME}`,
          encodedCredential: Buffer.from(
            `${process.env.USERNAME}:${process.env.PASSWORD}`
          ).toString('base64')
        }
      })
    ),
    credentials: new CredentialsModule({
      credentialProtocols: [
        new V2CredentialProtocol({
          credentialFormats: [new JsonLdCredentialFormatService()]
        })
      ]
    }),
    proofs: new ProofsModule({
      proofProtocols: [
        new V2ProofProtocol({
          proofFormats: [new JsonLdProofFormatService()]
        })
      ]
    })
  },
  dependencies: agentDependencies
})

// Register a simple `WebSocket` outbound transport
holder.registerOutboundTransport(new WsOutboundTransport())

// Register a simple `Http` outbound transport
holder.registerOutboundTransport(new HttpOutboundTransport())

// Register a simple `Http` inbound transport
holder.registerInboundTransport(new HttpInboundTransport({ port: 3001 }))

// Initialize the agent
await holder.initialize()

