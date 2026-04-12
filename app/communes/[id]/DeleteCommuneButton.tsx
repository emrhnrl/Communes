'use client'

import { useTransition } from 'react'
import { deleteCommune } from './edit/actions'

interface DeleteCommuneButtonProps {
  communeId: string
}

export default function DeleteCommuneButton({ communeId }: DeleteCommuneButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm('Delete this commune? This cannot be undone.')) return
    startTransition(async () => {
      await deleteCommune(communeId)
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-xs text-zinc-400 underline-offset-2 transition-colors hover:text-red-500 hover:underline disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-500"
    >
      {isPending ? 'Deleting…' : 'Delete commune'}
    </button>
  )
}
