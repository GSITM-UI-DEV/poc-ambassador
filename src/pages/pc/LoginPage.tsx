import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Check } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { useAuth } from '@/stores/auth'

const BENEFITS = [
  '회원 전용가 최대 15% 할인',
  '결제 금액의 최대 5% 포인트 적립',
  '가입 즉시 웰컴 쿠폰 10,000원',
  '기념일 케어 서비스',
]

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuth((s) => s.login)
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')

  const from = (location.state as { from?: string } | null)?.from ?? '/'

  // 목업 — 어떤 입력이든 홍길동 GOLD 세션
  const doLogin = () => {
    login()
    navigate(from, { replace: true })
  }

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-cream py-16">
      <div className="grid w-full max-w-[880px] grid-cols-[1fr_360px] overflow-hidden rounded-2xl bg-surface shadow-sm">
        {/* 로그인 폼 */}
        <div className="px-12 py-14">
          <p className="text-display text-[24px] tracking-[0.15em]">AMBATEL</p>
          <p className="mt-1 text-[11px] tracking-[0.3em] text-brand-gold">
            AMBASSADOR HOTELS
          </p>
          <h1 className="mt-8 text-[22px] font-bold">로그인</h1>

          <div className="mt-6 space-y-3">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-lg border border-line px-4 text-[15px] outline-none focus:border-brand-gold"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && doLogin()}
              className="h-12 w-full rounded-lg border border-line px-4 text-[15px] outline-none focus:border-brand-gold"
            />
            <div className="flex items-center justify-between pl-1">
              <label className="flex items-center gap-2 text-[13px] text-text-secondary">
                <input type="checkbox" defaultChecked className="accent-brand-gold" />
                자동 로그인
              </label>
              <button className="cursor-pointer text-[13px] text-text-secondary hover:text-text-primary">
                비밀번호 찾기
              </button>
            </div>
            <Button full onClick={doLogin}>
              로그인
            </Button>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-line" />
            <span className="text-[12px] text-text-secondary">간편 로그인</span>
            <div className="h-px flex-1 bg-line" />
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <SocialBtn bg="#FEE500" fg="#1C1B19" label="카카오" onClick={doLogin} />
            <SocialBtn bg="#03C75A" fg="#fff" label="네이버" onClick={doLogin} />
            <SocialBtn bg="#fff" fg="#1C1B19" border label="Google" onClick={doLogin} />
          </div>

          <p className="mt-8 text-center text-[13px] text-text-secondary">
            아직 회원이 아니신가요?{' '}
            <button
              onClick={doLogin}
              className="cursor-pointer font-semibold text-brand-gold hover:underline"
            >
              회원가입
            </button>
          </p>
        </div>

        {/* 가치제안 패널 */}
        <div className="relative flex flex-col justify-end bg-brand-dark p-10">
          <img
            src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=70"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="relative">
            <p className="text-eyebrow text-brand-gold-light">MEMBER BENEFITS</p>
            <p className="mt-2 text-[19px] leading-snug font-bold text-text-inverse">
              회원으로 예약하면
              <br />더 많은 혜택이 함께해요
            </p>
            <ul className="mt-5 space-y-2.5">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-center gap-2 text-[13px] text-text-inverse/85">
                  <Check size={14} strokeWidth={3} className="shrink-0 text-brand-gold" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function SocialBtn({
  bg,
  fg,
  label,
  border,
  onClick,
}: {
  bg: string
  fg: string
  label: string
  border?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: bg, color: fg }}
      className={`h-11 cursor-pointer rounded-lg text-[13px] font-semibold ${border ? 'border border-line' : ''}`}
    >
      {label}
    </button>
  )
}
