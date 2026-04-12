'use client'

import { useTransition } from 'react'
import { deleteEvent } from '@/app/communes/[id]/events/[eventId]/edit/actions'

interface DeleteEventButtonProps {
  communeId: string
  eventId: string
}

export default function DeleteEventButton({ communeId, eventId }: DeleteEventButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm('Delete this event? This cannot be undone.')) return
    startTransition(async () => {
      await deleteEvent(communeId, eventId)
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-xs text-zinc-400 underline-offset-2 transition-colors hover:text-red-500 hover:underline disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-500"
    >
      {isPending ? 'Deleting…' : 'Delete'}
    </button>
  )
}
