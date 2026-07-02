import { Outlet, useLocation } from 'react-router'
import { useEffect } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

export function PcLayout() {
  const location = useLocation()
  // 메인은 히어로 위에 헤더 오버레이
  const isMain = location.pathname === '/'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-surface">
      <Header overlay={isMain} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
