'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { updateProfile, ProfileFormState } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-teal-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Saving…' : 'Save changes'}
    </button>
  )
}

interface EditProfileFormProps {
  initialDisplayName: string | null
  initialAvatarUrl: string | null
}

export default function EditProfileForm({
  initialDisplayName,
  initialAvatarUrl,
}: EditProfileFormProps) {
  const initialState: ProfileFormState = { error: null }
  const [state, action] = useActionState(updateProfile, initialState)

  return (
    <form action={action} className="flex flex-col gap-4">
      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="rounded-lg bg-teal-50 px-4 py-3 text-sm text-teal-700 dark:bg-teal-950 dark:text-teal-300">
          Profile updated successfully.
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="display_name"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Display name
        </label>
        <input
          id="display_name"
          name="display_name"
          type="text"
          maxLength={50}
          defaultValue={initialDisplayName ?? ''}
          placeholder="Your name"
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="avatar_url"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Avatar URL
        </label>
        <input
          id="avatar_url"
          name="avatar_url"
          type="url"
          defaultValue={initialAvatarUrl ?? ''}
          placeholder="https://…"
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500"
        />
      </div>

      <div className="pt-1">
        <SubmitButton />
      </div>
    </form>
  )
}
