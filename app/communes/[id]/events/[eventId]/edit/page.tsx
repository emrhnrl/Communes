import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppHeader from '@/app/components/AppHeader'
import AuthButton from '@/app/components/AuthButton'
import EditEventForm from './EditEventForm'

async function getEventForEdit(eventId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single()
  return data
}

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string; eventId: string }>
}) {
  const { id: communeId, eventId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/auth/sign-in?redirectTo=/communes/${communeId}/events/${eventId}/edit`)

  const event = await getEventForEdit(eventId)
  if (!event) notFound()

  if (event.created_by !== user.id) redirect(`/communes/${communeId}`)

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AppHeader className="justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Communes
        </Link>
        <AuthButton />
      </AppHeader>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <Link
          href={`/communes/${communeId}`}
          className="mb-8 flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
            <path fillRule="evenodd" d="M14 8a.75.75 0 0 1-.75.75H4.56l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 1.06L4.56 7.25h8.69A.75.75 0 0 1 14 8Z" clipRule="evenodd" />
          </svg>
          Back to commune
        </Link>

        <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="mb-8 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Edit event
          </h1>
          <EditEventForm event={event} communeId={communeId} />
        </div>
      </main>
    </div>
  )
}
