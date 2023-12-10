import { issuer } from '@/lib/issuer'
import { NextApiRequest, NextApiResponse } from 'next'

export interface Invitation {
  invitationUrl: string
}

export const outOfBandRecord = await issuer.oob.createInvitation()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Invitation>
) {
  res.status(200).json({
    invitationUrl: outOfBandRecord.outOfBandInvitation.toUrl({
      domain: 'https://example.org'
    })
  })
}
