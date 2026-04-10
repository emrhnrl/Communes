# Component Examples

## Card Component
```tsx
interface CardProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export default function Card({ title, description, children }: CardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      {children}
    </div>
  )
}
```

## Badge Component
```tsx
interface BadgeProps {
  label: string
  variant?: 'default' | 'success' | 'warning'
}

export default function Badge({ label, variant = 'default' }: BadgeProps) {
  const styles = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[variant]}`}>
      {label}
    </span>
  )
}
```