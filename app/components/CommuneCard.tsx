import Link from 'next/link'
import { Database } from '@/lib/types'

type Commune = Database['public']['Tables']['communes']['Row']

export default function CommuneCard({
  commune,
  memberCount,
}: {
  commune: Commune
  memberCount: number
}) {
  return (
    <Link
      href={`/communes/${commune.id}`}
      className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-lg font-semibold leading-snug text-zinc-900 dark:text-zinc-50">
          {commune.name}
        </h2>
        {commune.category && (
          <span className="shrink-0 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-600 dark:bg-teal-950 dark:text-teal-300">
            {commune.category}
          </span>
        )}
      </div>

      {commune.description && (
        <p className="line-clamp-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          {commune.description}
        </p>
      )}

      <div className="mt-auto flex items-center gap-4 pt-2 text-xs text-zinc-400 dark:text-zinc-500">
        {commune.city && (
          <span className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-3.5"
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
        <span className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="size-3.5"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          {memberCount} {memberCount === 1 ? 'member' : 'members'}
        </span>
      </div>
    </Link>
  )
}