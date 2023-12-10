import { useRef, useState } from 'react'
import { Invitation } from '@/pages/api/createNewInvitation'
import { OutOfBoundRecordResponse } from '@/pages/api/acceptInvitation'

export default function Dashboard() {
  // Sample state for input fields
  const [invitationUrl, setInvitationUrl] = useState('')
  const [outOfBandRecord, setOutOfBandRecord] = useState<Record<string, any>>()
  const createInvitationButtonRef = useRef<HTMLButtonElement>(null)
  const acceptInvitationbuttonRef = useRef<HTMLButtonElement>(null)
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='flex w-3/4'>
        <div className='flex flex-col items-center justify-center w-1/2 border border-gray-200 shadow rounded-md mr-2 p-4'>
          <h1 className='text-lg font-semibold'>Issuer</h1>
          <button
            className='mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700'
            onClick={async () => {
              createInvitationButtonRef.current!.style.background = '#464646'
              const res = await fetch('/api/createNewInvitation')
              const json = (await res.json()) as Invitation
              setInvitationUrl(json.invitationUrl)
            }}
            ref={createInvitationButtonRef}
          >
            1. Create new invitation
          </button>
          <textarea
            value={invitationUrl}
            readOnly
            className='w-64 p-2 mt-3 border border-gray-300 rounded monospace'
            style={{ fontFamily: 'monospace', overflowY: 'hidden' }}
          />
        </div>

        <div className='flex flex-col items-center justify-center w-1/2 border border-gray-200 shadow rounded-md ml-2 p-4'>
          <h1 className='text-lg font-semibold'>Holder</h1>
          <textarea
            value={invitationUrl}
            onChange={e => setInvitationUrl(e.target.value)}
            className='mt-4 p-2 border border-gray-300 rounded'
            style={{ fontFamily: 'monospace', overflowY: 'hidden' }}
          />
          <button
            className='mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700'
            ref={acceptInvitationbuttonRef}
            onClick={async () => {
              acceptInvitationbuttonRef.current!.style.background = '#464646'
              const res = await fetch('/api/acceptInvitation', {
                method: 'POST',
                body: JSON.stringify({
                  invitationUrl
                })
              })
              setOutOfBandRecord(
                ((await res.json()) as OutOfBoundRecordResponse).outOfBandRecord
              )
            }}
          >
            2. Recieve Invitation
          </button>
          <textarea
            value={JSON.stringify(outOfBandRecord, null, 2)}
            readOnly
            className='mt-4 p-2 border border-gray-300 rounded'
            style={{ fontFamily: 'monospace', overflowY: 'hidden' }}
          />
        </div>
      </div>
    </div>
  )
}
