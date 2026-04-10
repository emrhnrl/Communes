import { ReactNode } from 'react'

interface AppHeaderProps {
  children: ReactNode
  className?: string
}

export default function AppHeader({ children, className }: AppHeaderProps) {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className={`mx-auto flex max-w-5xl items-center px-6 py-4${className ? ` ${className}` : ''}`}>
        {children}
      </div>
    </header>
  )
}