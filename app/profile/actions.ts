'use server'

import { createClient } from '@/lib/supabase/server'

export type ProfileFormState = {
  error: string | null
  success?: boolean
}

export async function updateProfile(
  prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be signed in to update your profile.' }
  }

  const displayName = formData.get('display_name')
  const avatarUrl = formData.get('avatar_url')

  const displayNameStr = typeof displayName === 'string' ? displayName.trim() : ''
  const avatarUrlStr = typeof avatarUrl === 'string' ? avatarUrl.trim() : ''

  if (displayNameStr.length > 50) {
    return { error: 'Display name must be 50 characters or fewer.' }
  }

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    display_name: displayNameStr || null,
    avatar_url: avatarUrlStr || null,
  })

  if (error) {
    return { error: 'Failed to update profile. Please try again.' }
  }

  return { error: null, success: true }
}
