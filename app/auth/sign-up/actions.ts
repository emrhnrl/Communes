'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type FormState = {
  error: string | null
  success: boolean
}

export async function signUp(
  redirectTo: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = formData.get('email')?.toString().trim() ?? ''
  const password = formData.get('password')?.toString() ?? ''

  if (!email || !password) return { error: 'Email and password are required.', success: false }
  if (password.length < 8) return { error: 'Password must be at least 8 characters.', success: false }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent(redirectTo || '/')}`,
    },
  })

  if (error) {
    console.error('Sign up error:', error.message)
    return { error: 'Something went wrong. Please try again.', success: false }
  }

  // If email confirmation is disabled in Supabase, sign in automatically
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect(redirectTo || '/')

  return { error: null, success: true }
}
