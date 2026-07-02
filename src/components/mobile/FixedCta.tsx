import type { ReactNode } from 'react'

// BottomNav(56px) 바로 위에 붙는 고정 CTA 영역 — Figma 플로우와 동일한 스택 구조
export function FixedCta({
  children,
  dark = false,
  withNav = true,
}: {
  children: ReactNode
  dark?: boolean
  withNav?: boolean
}) {
  return (
    <div
      className={`fixed inset-x-0 z-20 mx-auto max-w-[430px] ${withNav ? 'bottom-14' : 'bottom-0 pb-safe'} ${
        dark ? 'bg-brand-dark' : 'border-t border-line bg-surface'
      } px-4 py-3`}
    >
      {children}
    </div>
  )
}
