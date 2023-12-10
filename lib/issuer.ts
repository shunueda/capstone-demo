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
  W3cCredentialsModule,
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

// Simple agent configuration. This sets some basic fields like the wallet
// configuration and the label. It also sets the mediator invitation url,
// because this is most likely required in a mobile environment.
const config: InitConfig = {
  label: 'demo-agent-issuer',
  walletConfig: {
    id: 'mainIssuer',
    key: 'demoagentissuer00000000000000000000'
  },
  logger: new ConsoleLogger(LogLevel.info),
  endpoints: ['http://localhost:3002']
}

// A new instance of an agent is created here
// Askar can also be replaced by the indy-sdk if required
export const issuer = new Agent({
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
    w3cCredentials: new W3cCredentialsModule(),
    proofs: new ProofsModule()
  },
  dependencies: agentDependencies
})

issuer.registerOutboundTransport(new WsOutboundTransport())

// Register a simple `Http` outbound transport
issuer.registerOutboundTransport(new HttpOutboundTransport())

// Register a simple `Http` inbound transport
issuer.registerInboundTransport(new HttpInboundTransport({ port: 3002 }))

// Initialize the agent
await issuer.initialize()
