import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'dark' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  full?: boolean
  children: ReactNode
}

const variantCls: Record<Variant, string> = {
  primary:
    'bg-brand-gold text-white hover:bg-brand-gold-light hover:text-brand-dark',
  secondary:
    'bg-transparent border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white',
  dark: 'bg-brand-dark text-text-inverse hover:bg-brand-dark-soft',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary',
}

const sizeCls: Record<Size, string> = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-12 px-6 text-[15px]',
  lg: 'h-13 px-8 text-[16px]',
}

export function Button({
  variant = 'primary',
  size = 'md',
  full,
  className = '',
  children,
  ...rest
}: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${variantCls[variant]} ${sizeCls[size]} ${full ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
