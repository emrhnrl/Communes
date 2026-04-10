import Image from 'next/image'

interface UserAvatarProps {
  name: string
  joinedAt: string
  avatarUrl?: string
}

function formatJoinDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function UserAvatar({ name, joinedAt, avatarUrl }: UserAvatarProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative size-10 shrink-0">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={name}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="flex size-10 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-600 dark:bg-teal-950 dark:text-teal-300">
            {getInitials(name)}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {name}
        </p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          Joined {formatJoinDate(joinedAt)}
        </p>
      </div>
    </div>
  )
}