import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Crown, ArrowRight } from 'lucide-react'
import { AppBar } from '@/components/mobile/AppBar'
import { Toggle } from '@/components/mobile/Toggle'
import { FixedCta } from '@/components/mobile/FixedCta'
import { Button } from '@/components/common/Button'
import { useBooking, calcPrice, formatPrice } from '@/stores/booking'
import { useAuth } from '@/stores/auth'

export function BenefitsPage() {
  const navigate = useNavigate()
  const member = useAuth((s) => s.member)
  const { packageId, options, benefits, setBenefits } = useBooking()

  // 미로그인 → 로그인 후 복귀 (제안서 시연 포인트)
  useEffect(() => {
    if (!member) {
      navigate('/mobile/login', { state: { from: '/mobile/booking/benefits' } })
    }
  }, [member, navigate])
  if (!member) return null

  const price = calcPrice(packageId ?? 'anniversary-dining-stay', options, benefits)
  const beforeBenefit = price.basePrice + price.optionsTotal
  const afterBenefit = beforeBenefit - price.memberDiscount - price.couponDiscount
  const welcomeCoupon = member.coupons[0]

  return (
    <div className="pb-40">
      <AppBar title="회원 혜택 적용" />

      {/* 멤버십 카드 */}
      <div className="mx-5 mt-5 rounded-2xl bg-brand-dark p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] tracking-[0.15em] text-text-inverse/50">CURRENT TIER</p>
            <p className="text-display mt-1 text-[22px] text-brand-gold-light">
              Gold Member
            </p>
          </div>
          <Crown size={22} className="text-brand-gold" />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
          <div>
            <p className="text-[11px] text-text-inverse/50">보유 포인트</p>
            <p className="mt-0.5 text-[17px] font-bold text-text-inverse">
              {formatPrice(member.points)} P
            </p>
          </div>
          <div>
            <p className="text-[11px] text-text-inverse/50">사용 가능 쿠폰</p>
            <p className="mt-0.5 text-[17px] font-bold text-text-inverse">
              {member.coupons.length} 장
            </p>
          </div>
        </div>
      </div>

      {/* 가격 전환 연출 */}
      <div className="mt-6 text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="text-[18px] text-text-secondary line-through">
            {formatPrice(beforeBenefit)}원
          </span>
          <ArrowRight size={16} className="text-brand-gold" />
          <span className="text-[24px] font-bold text-brand-gold">
            {formatPrice(afterBenefit)}원
          </span>
        </div>
        <span className="mt-2 inline-block rounded-full bg-brand-gold px-4 py-1 text-[12px] font-semibold text-white">
          실시간 {formatPrice(price.savedTotal)}원 절약 중
        </span>
      </div>

      {/* 할인 내역 */}
      <div className="mx-5 mt-5 rounded-2xl border border-line p-5">
        <Row label="패키지 + 옵션 기본가" value={`${formatPrice(beforeBenefit)}원`} />
        <Row
          label="회원 전용 할인"
          value={`-${formatPrice(price.memberDiscount)}원`}
          accent
        />
        {price.couponDiscount > 0 && (
          <Row label="웰컴 쿠폰 적용" value={`-${formatPrice(price.couponDiscount)}원`} accent />
        )}
        {price.usedPoints > 0 && (
          <Row label="포인트 사용" value={`-${formatPrice(price.usedPoints)}원`} accent />
        )}
        <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
          <span className="text-[14px] font-semibold">최종 결제 금액</span>
          <span className="text-[20px] font-bold text-brand-gold">
            {formatPrice(price.total)}원
          </span>
        </div>
        <p className="mt-1.5 text-right text-[11px] font-medium text-success">
          혜택 시 {formatPrice(price.expectedPoints)}P 적립 예정
        </p>
      </div>

      {/* 쿠폰 적용 */}
      <div className="mx-5 mt-5">
        <p className="text-[14px] font-bold">쿠폰 적용</p>
        <div className="mt-2.5 flex items-center justify-between rounded-xl border border-line px-4 py-3.5">
          <p className="text-[14px]">
            {welcomeCoupon.name}{' '}
            <span className="font-semibold text-brand-gold">
              (-{formatPrice(welcomeCoupon.amount)}원)
            </span>
          </p>
          <Toggle
            on={benefits.couponId === welcomeCoupon.id}
            onChange={() =>
              setBenefits({
                couponId: benefits.couponId === welcomeCoupon.id ? null : welcomeCoupon.id,
              })
            }
          />
        </div>
      </div>

      {/* 포인트 사용 */}
      <div className="mx-5 mt-5">
        <div className="flex items-baseline justify-between">
          <p className="text-[14px] font-bold">포인트 사용</p>
          <p className="text-[12px] text-text-secondary">
            보유 포인트 {formatPrice(member.points)}P
          </p>
        </div>
        <div className="mt-2.5 flex gap-2">
          <div className="flex h-12 flex-1 items-center rounded-xl border border-line px-4">
            <input
              type="text"
              inputMode="numeric"
              value={benefits.usedPoints ? formatPrice(benefits.usedPoints) : ''}
              placeholder="0"
              onChange={(e) => {
                const n = Number(e.target.value.replaceAll(',', '')) || 0
                setBenefits({ usedPoints: Math.min(n, member.points) })
              }}
              className="w-full bg-transparent text-[15px] font-semibold outline-none"
            />
            <span className="text-[14px] text-text-secondary">P</span>
          </div>
          <button
            onClick={() => setBenefits({ usedPoints: member.points })}
            className="cursor-pointer rounded-xl border border-brand-gold px-4 text-[13px] font-semibold text-brand-gold"
          >
            전액 사용
          </button>
        </div>
      </div>

      <FixedCta>
        <Button full onClick={() => navigate('/mobile/booking/payment')}>
          혜택 적용하고 계속하기
        </Button>
      </FixedCta>
    </div>
  )
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[13px] text-text-secondary">{label}</span>
      <span className={`text-[14px] font-semibold ${accent ? 'text-brand-gold' : ''}`}>
        {value}
      </span>
    </div>
  )
}
