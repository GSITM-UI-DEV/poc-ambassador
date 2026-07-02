import { Link, NavLink, useNavigate } from 'react-router'
import { useAuth } from '@/stores/auth'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'

const GNB = [
  { label: '호텔 찾기', to: '/search' },
  { label: '스페셜 오퍼', to: '/offers' },
  { label: '다이닝', to: '/search?purpose=dining' },
  { label: '웨딩 · 연회', to: '/offers' },
  { label: '멤버십', to: '/mypage' },
]

export function Header({ overlay = false }: { overlay?: boolean }) {
  const { member, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header
      className={
        overlay
          ? 'absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-black/60 to-transparent'
          : 'sticky top-0 z-30 bg-brand-dark'
      }
    >
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center gap-10 px-8">
        <Link to="/" className="flex flex-col leading-none">
          <span className="text-display text-[22px] tracking-[0.2em] text-text-inverse">
            AMBATEL
          </span>
          <span className="text-[10px] tracking-[0.3em] text-brand-gold-light">
            AMBASSADOR HOTELS
          </span>
        </Link>

        <nav className="flex flex-1 items-center gap-7">
          {GNB.map((m) => (
            <NavLink
              key={m.label}
              to={m.to}
              className="text-[14px] font-medium text-text-inverse/80 transition-colors hover:text-brand-gold-light"
            >
              {m.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {member ? (
            <div className="flex items-center gap-2">
              <Link to="/mypage" className="flex items-center gap-2 text-[14px] text-text-inverse hover:text-brand-gold-light">
                {member.name}님
                <Badge tone="gold">{member.tier}</Badge>
              </Link>
              <button
                onClick={logout}
                className="text-[12px] text-text-inverse/50 hover:text-text-inverse cursor-pointer"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-[14px] text-text-inverse/80 hover:text-brand-gold-light"
            >
              로그인 / 회원가입
            </Link>
          )}
          <Button size="sm" onClick={() => navigate('/search')}>
            예약하기
          </Button>
        </div>
      </div>
    </header>
  )
}
