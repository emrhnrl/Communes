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

  async function handleLeave() {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase
      .from('members')
      .delete()
      .eq('commune_id', communeId)
      .eq('user_id', user.id)

    if (error) {
      setError('Something went wrong. Please try again.')
    } else {
      setJoined(false)
    }

    setLoading(false)
  }

  if (joined) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <p className="text-sm font-medium text-teal-600 dark:text-teal-400">
            You&apos;re a member
          </p>
          <button
            onClick={handleLeave}
            disabled={loading}
            className="text-xs text-zinc-400 underline-offset-2 transition-colors hover:text-red-500 hover:underline disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-500"
          >
            {loading ? 'Leaving…' : 'Leave commune'}
          </button>
        </div>
        {error && (
          <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
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
