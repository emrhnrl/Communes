'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { moderateContent } from '@/lib/moderation'

export type FormState = {
  error: string | null
}

export async function createEvent(
  communeId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const title = formData.get('title')?.toString().trim() ?? ''
  const description = formData.get('description')?.toString().trim() || null
  const day = formData.get('event_date_day')?.toString() ?? ''
  const time = formData.get('event_date_time')?.toString() ?? '12:00'
  const location = formData.get('location')?.toString().trim() || null

  if (!title) return { error: 'Title is required.' }
  if (title.length > 100) return { error: 'Title must be 100 characters or fewer.' }
  if (description && description.length > 500) return { error: 'Description must be 500 characters or fewer.' }
  if (location && location.length > 100) return { error: 'Location must be 100 characters or fewer.' }
  if (!day) return { error: 'Date and time are required.' }

  const [h, m] = time.split(':')
  const eventDate = `${day}T${h.padStart(2, '0')}:${m}:00`

  const moderation = await moderateContent({ title, description: description ?? '' })
  if (!moderation.approved) return { error: moderation.reason }

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be signed in to create an event.' }

  const { error } = await supabase.from('events').insert({
    commune_id: communeId,
    title,
    description,
    event_date: new Date(eventDate).toISOString(),
    location,
    created_by: user.id,
  })

  if (error) {
    console.error('Failed to create event:', error.message)
    return { error: 'Something went wrong. Please try again.' }
  }

  redirect(`/communes/${communeId}`)
}
