'use server'

import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'

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

  if (!name) {
    return { error: 'Name is required.' }
  }

  const { error } = await supabase.from('communes').insert({
    name,
    description,
    category,
    city,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/')
}
