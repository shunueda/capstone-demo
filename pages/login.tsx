import React, { FormEvent, useState } from 'react'
import { generateToken, users } from '@/lib/users'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (password == users[username]) {
      const token = generateToken(username)
      router.push(`/?token=${token}`)
    } else {
      window.alert('Invalid username or password')
      setUsername('')
      setPassword('')
    }
  }
  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <form onSubmit={handleSubmit} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        <div className='mb-4'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='username'>
            Username
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            id='username'
            type='text'
            placeholder=''
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className='mb-6'>
          <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
            Password
          </label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
            id='password'
            type='password'
            placeholder=''
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className='flex items-center justify-between'>
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            type='submit'>
            Sign In
          </button>
        </div>
      </form>
    </div>
  )
}