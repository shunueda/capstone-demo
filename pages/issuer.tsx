import { Agent } from '@aries-framework/core'

const createNewInvitation = async (agent: Agent) => {
  const outOfBandRecord = await agent.oob.createInvitation();
  return {
    invitationUrl: outOfBandRecord.outOfBandInvitation.toUrl({
      domain: "https://example.org",
    }),
    outOfBandRecord,
  };
};