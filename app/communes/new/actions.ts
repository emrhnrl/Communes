'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { moderateContent } from '@/lib/moderation'

export type FormState = {
  error: string | null
}

export async function createCommune(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = formData.get('name')?.toString().trim() ?? ''
  const description = formData.get('description')?.toString().trim() || null
  const category = formData.get('category')?.toString() || null
  const city = formData.get('city')?.toString().trim() || null

  if (!name) return { error: 'Name is required.' }
  if (name.length > 100) return { error: 'Name must be 100 characters or fewer.' }
  if (description && description.length > 500) return { error: 'Description must be 500 characters or fewer.' }
  if (city && city.length > 100) return { error: 'City must be 100 characters or fewer.' }

  const moderation = await moderateContent({ title: name, description: description ?? '' })
  if (!moderation.approved) return { error: moderation.reason }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be signed in to create a commune.' }

  const { error } = await supabase.from('communes').insert({
    name,
    description,
    category,
    city,
    created_by: user.id,
  })

  if (error) {
    console.error('Failed to create commune:', error.message)
    return { error: 'Something went wrong. Please try again.' }
  }

  redirect('/')
}
