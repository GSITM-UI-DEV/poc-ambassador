import { Outlet, useLocation } from 'react-router'
import { useEffect } from 'react'
import { BottomNav } from './BottomNav'

// Figma 플로우는 고정 CTA 바 + BottomNav를 함께 노출 — 로그인만 숨긴다
const HIDE_NAV_PREFIXES = ['/mobile/login']

export function MobileLayout() {
  const location = useLocation()
  const hideNav = HIDE_NAV_PREFIXES.some((p) => location.pathname.startsWith(p))

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-surface shadow-[0_0_40px_rgba(0,0,0,0.08)]">
      <Outlet />
      {!hideNav && <BottomNav />}
    </div>
  )
}
