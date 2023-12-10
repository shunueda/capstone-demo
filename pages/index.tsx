import { useState } from 'react'
import useAsyncEffect from 'use-async-effect'
import { InitializedAgentNames } from '@/pages/api/initialize'
import Link from 'next/link'

export default function Home() {
  const [initializedAgentNames, setInitializedAgentNames] =
    useState<InitializedAgentNames>()
  useAsyncEffect(async () => {
    try {
      const res = await fetch('/api/initialize')
      const json = (await res.json()) as InitializedAgentNames
      setInitializedAgentNames(json)
    } catch (e) {
      console.error(e)
    }
  }, [])
  return (
    <>
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <div className='flex'>
          <div className='p-4 border border-gray-200 shadow rounded-md mr-4'>
            <h1 className='text-lg font-semibold text-center'>Holder Agent</h1>
            {initializedAgentNames ? (
              initializedAgentNames.holder
            ) : (
              <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mr-auto ml-auto mt-3' />
            )}
          </div>
          <div className='p-4 border border-gray-200 shadow rounded-md'>
            <h1 className='text-lg font-semibold text-center'>Issuer Agent</h1>
            {initializedAgentNames ? (
              initializedAgentNames.issuer
            ) : (
              <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mr-auto ml-auto mt-3' />
            )}
          </div>
        </div>
        <Link href='/dashboard'>
          <button
            className={`mt-4 px-6 py-2 rounded text-white font-bold ${
              initializedAgentNames
                ? 'bg-blue-500 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!initializedAgentNames}
          >
            {initializedAgentNames ? 'Continue' : 'Initializing agents...'}
          </button>
        </Link>
      </div>
    </>
  )
}
