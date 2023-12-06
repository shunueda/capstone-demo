import { GetServerSidePropsContext } from 'next'
import { ariesAskar } from '@hyperledger/aries-askar-nodejs'
import { AskarModule } from '@aries-framework/askar'
import { agentDependencies, HttpInboundTransport } from '@aries-framework/node'
import {
  Agent,
  ConnectionsModule,
  CredentialsModule,
  DidsModule, HttpOutboundTransport,
  InitConfig, JsonLdCredentialFormatService, ProofsModule,
  V2CredentialProtocol, W3cCredentialsModule, WsOutboundTransport
} from '@aries-framework/core'
import { tokens } from '@/lib/users'
import {
  OracleDidRegistrar,
  OracleDidResolver,
  OracleModule,
  OracleModuleConfig
} from '@lehigh-oracle-did23/aries-framework-oracle'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.query.token as string | undefined
  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }
  const user = tokens[token]
  console.log("initializing agent")
  const agent = await initializeIssuerAgent()
  console.log("initialized agent")
  return {
    props: {
      agent: 'agent'
    } satisfies Props
  }
}

interface Props {
  agent: string
}

export default function Home(props: Props) {
  return <>Search: {props.agent}</>
}

const initializeIssuerAgent = async () => {
  // Simple agent configuration. This sets some basic fields like the wallet
  // configuration and the label. It also sets the mediator invitation url,
  // because this is most likely required in a mobile environment.
  const config: InitConfig = {
    label: "demo-agent-issuer",
    walletConfig: {
      id: "mainIssuer",
      key: "demoagentissuer00000000000000000000",
    }
  };

  // A new instance of an agent is created here
  // Askar can also be replaced by the indy-sdk if required
  const issuer = new Agent({
    config,
    modules: {
      askar: new AskarModule({ ariesAskar }),
      connections: new ConnectionsModule({ autoAcceptConnections: true }),
      dids: new DidsModule({
        registrars: [new OracleDidRegistrar()],
        resolvers: [new OracleDidResolver()],
      }),
      oracle: new OracleModule(
        new OracleModuleConfig({
          networkConfig: {
            network: `${process.env.BC_URL}`,
            channel: `${process.env.BC_CHANNEL}`,
            chaincode: `${process.env.BC_DID_CHAINCODE_NAME}`,
            encodedCredential: Buffer.from(
              `${process.env.USERNAME}:${process.env.PASSWORD}`
            ).toString("base64"),
          },
        })
      ),
      credentials: new CredentialsModule({
        credentialProtocols: [
          new V2CredentialProtocol({
            credentialFormats: [new JsonLdCredentialFormatService()],
          }),
        ],
      }),
      w3cCredentials: new W3cCredentialsModule(),
      proofs: new ProofsModule(),
    },
    dependencies: agentDependencies,
  });

  // Register a simple `WebSocket` outbound transport
  issuer.registerOutboundTransport(new WsOutboundTransport());

  // Register a simple `Http` outbound transport
  issuer.registerOutboundTransport(new HttpOutboundTransport());

  // Register a simple `Http` inbound transport
  issuer.registerInboundTransport(new HttpInboundTransport({ port: 3002 }));

  // Initialize the agent
  await issuer.initialize();

  return issuer;
};