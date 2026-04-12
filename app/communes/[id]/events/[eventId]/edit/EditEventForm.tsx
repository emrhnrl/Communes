'use client'

import { useActionState, useState, useRef, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { updateEvent, FormState } from './actions'
import { Database } from '@/lib/types'

type Event = Database['public']['Tables']['events']['Row']

const ITEM_HEIGHT = 36
const VISIBLE_ITEMS = 8

function TimeSelect({
  name,
  options,
  defaultValue,
}: {
  name: string
  options: string[]
  defaultValue: string
}) {
  const [value, setValue] = useState(defaultValue)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const maxHeight = ITEM_HEIGHT * VISIBLE_ITEMS

  return (
    <div ref={ref} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-24 items-center justify-center gap-1 rounded-xl border border-zinc-200 bg-white py-2.5 text-sm text-zinc-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
      >
        {value}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-3 text-zinc-400">
          <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute left-0 top-full z-10 mt-1 w-24 overflow-y-auto rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
          style={{ maxHeight }}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { setValue(opt); setOpen(false) }}
              className={`flex w-full items-center justify-center text-sm transition-colors hover:bg-teal-50 dark:hover:bg-zinc-700 ${
                opt === value
                  ? 'bg-teal-600 font-medium text-white'
                  : 'text-zinc-900 dark:text-zinc-50'
              }`}
              style={{ height: ITEM_HEIGHT }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2)
  const m = i % 2 === 0 ? '00' : '30'
  return `${h}:${m}`
})

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-teal-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Saving…' : 'Save changes'}
    </button>
  )
}

interface EditEventFormProps {
  event: Event
  communeId: string
}

export default function EditEventForm({ event, communeId }: EditEventFormProps) {
  const initialState: FormState = { error: null }
  const boundAction = updateEvent.bind(null, communeId, event.id)
  const [state, action] = useActionState(boundAction, initialState)

  const eventDate = new Date(event.event_date)
  const defaultDay = eventDate.toISOString().slice(0, 10)
  const defaultHour = eventDate.getUTCHours()
  const defaultMinute = eventDate.getUTCMinutes() < 30 ? '00' : '30'
  const defaultTime = `${defaultHour}:${defaultMinute}`

  return (
    <form action={action} className="flex flex-col gap-6">
      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={event.title}
          maxLength={200}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Date & time <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              id="event_date_day"
              name="event_date_day"
              type="date"
              required
              defaultValue={defaultDay}
              className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
            <TimeSelect name="event_date_time" options={TIME_OPTIONS} defaultValue={defaultTime} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="location" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            defaultValue={event.location ?? ''}
            maxLength={100}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={event.description ?? ''}
          maxLength={500}
          className="resize-none rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500"
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton />
        <Link
          href={`/communes/${communeId}`}
          className="rounded-full px-6 py-2.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
