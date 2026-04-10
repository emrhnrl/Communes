'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface JoinButtonProps {
  communeId: string
  initialIsMember: boolean
}

export default function JoinButton({ communeId, initialIsMember }: JoinButtonProps) {
  const [joined, setJoined] = useState(initialIsMember)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleJoin() {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push(`/auth/sign-in?redirectTo=/communes/${communeId}`)
      return
    }

    const { error } = await supabase
      .from('members')
      .insert({ commune_id: communeId, user_id: user.id })

    if (error) {
      setError('Something went wrong. Please try again.')
    } else {
      setJoined(true)
    }

    setLoading(false)
  }

  if (joined) {
    return (
      <p className="text-sm font-medium text-teal-600 dark:text-teal-400">
        You&apos;re a member
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleJoin}
        disabled={loading}
        className="w-fit rounded-full bg-teal-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Joining…' : 'Join commune'}
      </button>
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
