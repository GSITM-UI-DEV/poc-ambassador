import type { ReactNode } from 'react'

type Tone = 'cream' | 'gold' | 'dark' | 'success' | 'danger' | 'outline'

const toneCls: Record<Tone, string> = {
  cream: 'bg-cream-card text-gold-serif',
  gold: 'bg-brand-gold text-white',
  dark: 'bg-brand-dark text-text-inverse',
  success: 'bg-success/10 text-success',
  danger: 'bg-danger/10 text-danger',
  outline: 'border border-line text-text-secondary bg-transparent',
}

export function Badge({
  tone = 'cream',
  children,
  className = '',
}: {
  tone?: Tone
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-medium whitespace-nowrap ${toneCls[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
