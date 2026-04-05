'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function JoinButton({ communeId }: { communeId: string }) {
  const [joined, setJoined] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleJoin() {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError('You must be signed in to join a commune.')
      setLoading(false)
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
      <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
        You&apos;ve joined this commune!
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleJoin}
        disabled={loading}
        className="w-fit rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Joining…' : 'Join commune'}
      </button>
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
