'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type FormState = {
  error: string | null
}

export async function updateCommune(
  communeId: string,
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

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be signed in to edit a commune.' }

  const { error } = await supabase
    .from('communes')
    .update({ name, description, category, city })
    .eq('id', communeId)
    .eq('created_by', user.id)

  if (error) {
    console.error('Failed to update commune:', error.message)
    return { error: 'Something went wrong. Please try again.' }
  }

  redirect(`/communes/${communeId}`)
}

export async function deleteCommune(communeId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase
    .from('communes')
    .delete()
    .eq('id', communeId)
    .eq('created_by', user.id)

  if (error) throw new Error('Failed to delete commune.')

  redirect('/')
}
