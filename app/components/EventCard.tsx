import { Database } from '@/lib/types'

type Event = Database['public']['Tables']['events']['Row']

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const date = new Date(event.event_date)
  const dateLabel = date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  const timeLabel = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{event.title}</h3>
        <span className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500">
          {dateLabel} · {timeLabel}
        </span>
      </div>

      {event.description && (
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {event.description}
        </p>
      )}

      {event.location && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
            <path fillRule="evenodd" d="M8 1.5A4.5 4.5 0 0 0 3.5 6c0 2.694 2.153 5.359 3.741 7.003a1.006 1.006 0 0 0 1.518 0C10.347 11.36 12.5 8.694 12.5 6A4.5 4.5 0 0 0 8 1.5ZM8 7.75a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5Z" clipRule="evenodd" />
          </svg>
          {event.location}
        </p>
      )}
    </div>
  )
}
