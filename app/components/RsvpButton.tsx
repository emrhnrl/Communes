'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface RsvpButtonProps {
  eventId: string
  initialIsGoing: boolean
  initialCount: number
  isLoggedIn: boolean
}

export default function RsvpButton({
  eventId,
  initialIsGoing,
  initialCount,
  isLoggedIn,
}: RsvpButtonProps) {
  const [going, setGoing] = useState(initialIsGoing)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleRsvp() {
    if (!isLoggedIn) {
      router.push('/auth/sign-in')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/sign-in')
      return
    }

    const { error } = await supabase
      .from('rsvps')
      .insert({ event_id: eventId, user_id: user.id })

    if (!error) {
      setGoing(true)
      setCount((c) => c + 1)
    }

    setLoading(false)
  }

  async function handleCancel() {
    setLoading(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('rsvps')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', user.id)

    if (!error) {
      setGoing(false)
      setCount((c) => Math.max(0, c - 1))
    }

    setLoading(false)
  }

  return (
    <div className="mt-4 flex items-center gap-3">
      {going ? (
        <>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="rounded-full bg-teal-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Updating…' : 'Going ✓'}
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="text-xs text-zinc-400 underline-offset-2 transition-colors hover:text-red-500 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          onClick={handleRsvp}
          disabled={loading}
          className="rounded-full border border-teal-600 px-4 py-1.5 text-sm font-medium text-teal-600 transition-colors hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-teal-950"
        >
          {loading ? 'Updating…' : "I'm going"}
        </button>
      )}
      {count > 0 && (
        <span className="text-xs text-zinc-400 dark:text-zinc-500">{count} going</span>
      )}
    </div>
  )
}
