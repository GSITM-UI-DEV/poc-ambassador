import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { AppBar } from '@/components/mobile/AppBar'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { useAuth } from '@/stores/auth'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuth((s) => s.login)
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')

  const from = (location.state as { from?: string } | null)?.from ?? '/mobile'

  // 목업 — 어떤 입력이든 홍길동 GOLD 세션
  const doLogin = () => {
    login()
    navigate(from, { replace: true })
  }

  return (
    <div className="pb-10">
      <AppBar title="로그인" />

      <div className="px-5 pt-10">
        <p className="text-display text-center text-[24px] tracking-[0.15em]">AMBATEL</p>
        <p className="mt-1 text-center text-[11px] tracking-[0.3em] text-brand-gold">
          AMBASSADOR HOTELS
        </p>

        <div className="mt-10 space-y-3">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 w-full rounded-xl border border-line px-4 text-[15px] outline-none focus:border-brand-gold"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && doLogin()}
            className="h-12 w-full rounded-xl border border-line px-4 text-[15px] outline-none focus:border-brand-gold"
          />
          <label className="flex items-center gap-2 pl-1 text-[13px] text-text-secondary">
            <input type="checkbox" defaultChecked className="accent-brand-gold" />
            자동 로그인
          </label>
          <Button full onClick={doLogin}>
            로그인
          </Button>
        </div>

        <div className="my-7 flex items-center gap-3">
          <div className="h-px flex-1 bg-line" />
          <span className="text-[12px] text-text-secondary">간편 로그인</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        <div className="space-y-2.5">
          <SocialBtn bg="#FEE500" fg="#1C1B19" label="카카오로 시작하기" onClick={doLogin} />
          <SocialBtn bg="#03C75A" fg="#fff" label="네이버로 시작하기" onClick={doLogin} />
          <SocialBtn bg="#fff" fg="#1C1B19" border label="Google로 시작하기" onClick={doLogin} />
        </div>

        {/* 회원 가치제안 */}
        <div className="mt-9 rounded-2xl bg-cream p-5">
          <p className="text-[14px] font-bold">회원이 되면 이런 혜택이</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge tone="cream" className="bg-white">회원 전용가 최대 15%</Badge>
            <Badge tone="cream" className="bg-white">최대 5% 포인트 적립</Badge>
            <Badge tone="cream" className="bg-white">웰컴 쿠폰 10,000원</Badge>
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
      className={`h-12 w-full cursor-pointer rounded-xl text-[14px] font-semibold ${border ? 'border border-line' : ''}`}
    >
      {label}
    </button>
  )
}
