interface ButtonProps {
  label: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export default function Button({
  label,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
}: ButtonProps) {
  const styles = {
    primary: 'bg-zinc-900 text-white hover:bg-zinc-700',
    secondary: 'bg-white text-zinc-900 border border-zinc-300 hover:bg-zinc-50',
    danger: 'bg-red-600 text-white hover:bg-red-500',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]}`}
    >
      {label}
    </button>
  )
}
