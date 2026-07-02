import { Badge } from './Badge'
import { formatPrice } from '@/stores/booking'
import { useAuth } from '@/stores/auth'
import { Link, useLocation } from 'react-router'
import { Lock } from 'lucide-react'

/**
 * 제안서 핵심 가격 표기 형식 (03-design.md):
 * 정가 취소선 / 회원가 / 등급 배지 / 적립 예정
 * 비로그인 시 회원가를 가리고 로그인 유도 (가치제안 시연 포인트)
 */
export function PriceBlock({
  listPrice,
  memberPrice,
  suffix = '~',
  align = 'right',
  showEarn = true,
  size = 'md',
}: {
  listPrice: number
  memberPrice: number
  suffix?: string
  align?: 'left' | 'right'
  showEarn?: boolean
  size?: 'sm' | 'md' | 'lg'
}) {
  const member = useAuth((s) => s.member)
  const location = useLocation()
  const isMobile = location.pathname.startsWith('/mobile')
  const alignCls = align === 'right' ? 'items-end text-right' : 'items-start text-left'
  const priceSize = size === 'lg' ? 'text-[22px]' : size === 'sm' ? 'text-[16px]' : 'text-[18px]'

  if (!member) {
    return (
      <div className={`flex flex-col gap-0.5 ${alignCls}`}>
        <span className="text-[13px] text-text-secondary line-through">
          정가 {formatPrice(listPrice)}원
        </span>
        <Link
          to={isMobile ? '/mobile/login' : '/login'}
          state={{ from: location.pathname }}
          className="inline-flex items-center gap-1 text-[14px] font-semibold text-brand-gold hover:underline"
        >
          <Lock size={13} strokeWidth={2.2} />
          로그인하고 회원가 보기
        </Link>
      </div>
    )
  }

  return (
    <div className={`flex flex-col gap-0.5 ${alignCls}`}>
      <span className="text-[13px] text-text-secondary line-through">
        정가 {formatPrice(listPrice)}원
      </span>
      <div className={`flex items-baseline gap-2 ${align === 'right' ? 'justify-end' : ''}`}>
        <span className={`font-bold text-text-primary ${priceSize}`}>
          회원가 {formatPrice(memberPrice)}원{suffix}
        </span>
        <Badge tone="gold">-15% GOLD</Badge>
      </div>
      {showEarn && (
        <span className="text-[12px] font-medium text-success">
          +{formatPrice(Math.round(memberPrice * 0.01))}P 적립 예정
        </span>
      )}
    </div>
  )
}
