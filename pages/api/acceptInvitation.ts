import { NextApiRequest, NextApiResponse } from 'next'
import { holder } from '@/lib/holder'

export interface OutOfBoundRecordResponse {
  outOfBandRecord: Record<string, unknown>
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OutOfBoundRecordResponse>
) {
  const { invitationUrl } = JSON.parse(req.body)
  const { outOfBandRecord } =
    await holder.oob.receiveInvitationFromUrl(invitationUrl)
  outOfBandRecord.toJSON()
  res.status(200).json({
    outOfBandRecord: outOfBandRecord.toJSON()
  })
}
