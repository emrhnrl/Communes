'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { signUp, FormState } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Creating account…' : 'Create account'}
    </button>
  )
}

interface SignUpFormProps {
  redirectTo: string
}

export default function SignUpForm({ redirectTo }: SignUpFormProps) {
  const initialState: FormState = { error: null, success: false }
  const boundAction = signUp.bind(null, redirectTo)
  const [state, action] = useActionState(boundAction, initialState)

  if (state.success) {
    return (
      <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-6 py-8 text-center dark:border-indigo-900 dark:bg-indigo-950">
        <p className="font-medium text-indigo-700 dark:text-indigo-300">Check your inbox</p>
        <p className="mt-1 text-sm text-indigo-600 dark:text-indigo-400">
          We sent you a link — click it and you&apos;re in!
        </p>
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="At least 8 characters"
          minLength={8}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500"
        />
      </div>

      <SubmitButton />

      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Already have an account?{' '}
        <Link
          href={`/auth/sign-in${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`}
          className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}
