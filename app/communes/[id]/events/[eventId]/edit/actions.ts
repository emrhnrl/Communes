'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type FormState = {
  error: string | null
}

export async function updateEvent(
  communeId: string,
  eventId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const title = formData.get('title')?.toString().trim() ?? ''
  const description = formData.get('description')?.toString().trim() || null
  const day = formData.get('event_date_day')?.toString() ?? ''
  const time = formData.get('event_date_time')?.toString() ?? '12:00'
  const location = formData.get('location')?.toString().trim() || null

  if (!title) return { error: 'Title is required.' }
  if (title.length > 200) return { error: 'Title must be 200 characters or fewer.' }
  if (description && description.length > 500) return { error: 'Description must be 500 characters or fewer.' }
  if (location && location.length > 100) return { error: 'Location must be 100 characters or fewer.' }
  if (!day) return { error: 'Date and time are required.' }

  const [h, m] = time.split(':')
  const eventDate = `${day}T${h.padStart(2, '0')}:${m}:00`
  const parsedDate = new Date(eventDate)
  if (isNaN(parsedDate.getTime())) return { error: 'Invalid date or time.' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'You must be signed in to edit an event.' }

  const { error } = await supabase
    .from('events')
    .update({
      title,
      description,
      event_date: parsedDate.toISOString(),
      location,
    })
    .eq('id', eventId)
    .eq('created_by', user.id)

  if (error) {
    console.error('Failed to update event:', error.message)
    return { error: 'Something went wrong. Please try again.' }
  }

  redirect(`/communes/${communeId}`)
}

export async function deleteEvent(communeId: string, eventId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId)
    .eq('created_by', user.id)

  if (error) throw new Error('Failed to delete event.')

  redirect(`/communes/${communeId}`)
}
