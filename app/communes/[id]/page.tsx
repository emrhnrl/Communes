import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CommuneQueryRow, parseCommuneWithMemberCount } from '@/lib/db'
import { Database } from '@/lib/types'
import AppHeader from '@/app/components/AppHeader'
import AuthButton from '@/app/components/AuthButton'
import EventCard from '@/app/components/EventCard'
import JoinButton from './JoinButton'

type Event = Database['public']['Tables']['events']['Row']

type MemberWithProfile = {
  id: string
  user_id: string
  created_at: string
  profiles: {
    display_name: string | null
    avatar_url: string | null
  } | null
}

async function getCommune(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('communes')
    .select('*, members(count)')
    .eq('id', id)
    .single()

  if (error || !data) return null

  const { member_count, ...commune } = parseCommuneWithMemberCount(data as CommuneQueryRow)
  return { ...commune, memberCount: member_count }
}

async function getEvents(communeId: string): Promise<Event[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('commune_id', communeId)
    .order('event_date', { ascending: true })
  return data ?? []
}

async function getMembers(communeId: string): Promise<MemberWithProfile[]> {
  const supabase = await createClient()

  const { data: memberRows } = await supabase
    .from('members')
    .select('id, user_id, created_at')
    .eq('commune_id', communeId)
    .order('created_at', { ascending: true })

  if (!memberRows || memberRows.length === 0) return []

  const userIds = memberRows.map((m) => m.user_id)

  const { data: profileRows } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url')
    .in('id', userIds)

  const profileMap = new Map(
    (profileRows ?? []).map((p) => [p.id, { display_name: p.display_name, avatar_url: p.avatar_url }])
  )

  return memberRows.map((m) => ({
    ...m,
    profiles: profileMap.get(m.user_id) ?? null,
  }))
}

async function getIsMember(communeId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { data } = await supabase
    .from('members')
    .select('id')
    .eq('commune_id', communeId)
    .eq('user_id', user.id)
    .maybeSingle()
  return !!data
}

export default async function CommuneDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [commune, events, isMember, members] = await Promise.all([
    getCommune(id),
    getEvents(id),
    getIsMember(id),
    getMembers(id),
  ])

  if (!commune) notFound()

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AppHeader className="justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Communes
        </Link>
        <AuthButton />
      </AppHeader>

      <main className="mx-auto max-w-2xl px-6 py-12">
        {/* Back link */}
        <Link
          href="/"
          className="mb-8 flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="size-3.5"
          >
            <path
              fillRule="evenodd"
              d="M14 8a.75.75 0 0 1-.75.75H4.56l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 1.06L4.56 7.25h8.69A.75.75 0 0 1 14 8Z"
              clipRule="evenodd"
            />
          </svg>
          All communes
        </Link>

        <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
          {/* Header row */}
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {commune.name}
            </h1>
            {commune.category && (
              <span className="shrink-0 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-600 dark:bg-teal-950 dark:text-teal-300">
                {commune.category}
              </span>
            )}
          </div>

          {/* Meta */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-400 dark:text-zinc-500">
            {commune.city && (
              <span className="flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="size-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 1.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9ZM2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13h-5a.5.5 0 0 1-.46-.302l-.761-1.77a1.964 1.964 0 0 0-.453-.618A5.984 5.984 0 0 1 2 6Zm3.5 8.75c0 .69.56 1.25 1.25 1.25h2.5c.69 0 1.25-.56 1.25-1.25V14h-5v.75Z"
                    clipRule="evenodd"
                  />
                </svg>
                {commune.city}
              </span>
            )}
            <a
              href="#members"
              className="flex items-center gap-1.5 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="size-4"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
              {commune.memberCount} {commune.memberCount === 1 ? 'member' : 'members'}
            </a>
          </div>

          {/* Divider */}
          <hr className="my-6 border-zinc-100 dark:border-zinc-800" />

          {/* Description */}
          {commune.description ? (
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {commune.description}
            </p>
          ) : (
            <p className="text-sm italic text-zinc-400 dark:text-zinc-500">
              The organiser hasn&apos;t added a description yet.
            </p>
          )}

          {/* Members */}
          {members.length > 0 && (
            <div id="members" className="mt-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                Members
              </h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {members.slice(0, 12).map((member) => {
                  const name = member.profiles?.display_name ?? 'Member'
                  const initial = name[0]?.toUpperCase() ?? '?'
                  return (
                    <div key={member.id} className="flex items-center gap-2.5">
                      {member.profiles?.avatar_url ? (
                        <img
                          src={member.profiles.avatar_url}
                          alt={name}
                          className="size-8 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-600 dark:bg-teal-950 dark:text-teal-300">
                          {initial}
                        </div>
                      )}
                      <span className="truncate text-sm text-zinc-700 dark:text-zinc-300">{name}</span>
                    </div>
                  )
                })}
              </div>
              {members.length > 12 && (
                <span className="mt-3 inline-block rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  +{members.length - 12} more
                </span>
              )}
            </div>
          )}

          {/* Join */}
          <div className="mt-8">
            <JoinButton communeId={commune.id} initialIsMember={isMember} />
          </div>
        </div>

        {/* Events */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Events
            </h2>
            {isMember && (
              <Link
                href={`/communes/${commune.id}/events/new`}
                className="rounded-full bg-teal-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-teal-500"
              >
                + New event
              </Link>
            )}
          </div>

          {events.length === 0 ? (
            <p className="text-sm italic text-zinc-400 dark:text-zinc-500">
              No events planned yet. Join and be the first to organise one!
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}
