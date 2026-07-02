import { NavLink, useNavigate } from 'react-router'
import { Home, Search, CalendarCheck, Gift, User } from 'lucide-react'

const TABS = [
  { label: '홈', to: '/mobile', icon: Home, end: true },
  { label: '검색', to: '/mobile/search', icon: Search },
  { label: '예약', to: '/mobile/booking/options', icon: CalendarCheck, cta: true },
  { label: '혜택', to: '/mobile/booking/benefits', icon: Gift },
  { label: 'MY', to: '/mobile/login', icon: User },
]

export function BottomNav() {
  const navigate = useNavigate()
  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[430px] border-t border-line bg-surface">
      <div className="grid h-14 grid-cols-5">
        {TABS.map(({ label, to, icon: Icon, cta, end }) =>
          cta ? (
            <button
              key={label}
              onClick={() => navigate(to)}
              className="relative flex flex-col items-center justify-center cursor-pointer"
            >
              <span className="absolute -top-4 flex h-11 w-11 items-center justify-center rounded-full bg-brand-gold text-white shadow-lg">
                <Icon size={20} />
              </span>
              <span className="mt-6 text-[10px] font-semibold text-brand-gold">{label}</span>
            </button>
          ) : (
            <NavLink
              key={label}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 text-[10px] ${
                  isActive ? 'text-brand-gold font-semibold' : 'text-text-secondary'
                }`
              }
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ),
        )}
      </div>
    </nav>
  )
}
