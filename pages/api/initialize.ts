import type { NextApiRequest, NextApiResponse } from 'next'
import { holder } from '@/lib/holder'
import { issuer } from '@/lib/issuer'

export interface InitializedAgentNames {
  holder: string
  issuer: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<InitializedAgentNames>
) {
  await Promise.all([import('../../lib/holder'), import('../../lib/issuer')])
  res.status(200).json({
    holder: holder.config.label,
    issuer: issuer.config.label
  })
}
