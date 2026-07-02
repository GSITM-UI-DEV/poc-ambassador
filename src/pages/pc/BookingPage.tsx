import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router'
import {
  UtensilsCrossed,
  Clock,
  Cake,
  Flower2,
  Building2,
  Crown,
  ShieldCheck,
  Loader2,
  PencilLine,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Toggle } from '@/components/mobile/Toggle'
import { BOOKING_OPTIONS, DINING_TIMES } from '@/data/options'
import { getPackage } from '@/data/packages'
import { getHotel } from '@/data/hotels'
import { useBooking, calcPrice, formatPrice } from '@/stores/booking'
import { useAuth } from '@/stores/auth'
import { fmtDay } from '@/lib/date'

const STEPS = ['옵션 선택', '혜택 적용', '결제'] as const

const ICONS: Record<string, React.ComponentType<{ size?: number | string; className?: string }>> = {
  utensils: UtensilsCrossed,
  clock: Clock,
  cake: Cake,
  flower: Flower2,
  building: Building2,
}

const METHODS = [
  { id: 'card', label: '신용카드' },
  { id: 'kakaopay', label: '카카오페이' },
  { id: 'naverpay', label: '네이버페이' },
  { id: 'foreign-card', label: '해외카드' },
] as const

export function BookingPage() {
  const navigate = useNavigate()
  const member = useAuth((s) => s.member)
  const booking = useBooking()
  const [step, setStep] = useState(0)
  const [paying, setPaying] = useState(false)

  const pkg = getPackage(booking.packageId ?? 'anniversary-dining-stay')
  if (!pkg) return <Navigate to="/search" replace />
  const hotel = getHotel(booking.hotelId ?? pkg.hotelId)!
  const price = calcPrice(pkg.id, booking.options, booking.benefits)

  const goStep = (next: number) => {
    // 혜택 단계부터 로그인 필요 — 로그인 후 복귀
    if (next >= 1 && !member) {
      navigate('/login', { state: { from: '/booking' } })
      return
    }
    setStep(next)
  }

  const pay = () => {
    setPaying(true)
    setTimeout(() => {
      booking.complete()
      navigate('/booking/complete')
    }, 1500)
  }

  return (
    <div className="bg-cream">
      <div className="mx-auto max-w-[1280px] px-8 py-10">
        {/* 스텝 인디케이터 */}
        <div className="flex items-center justify-center gap-3">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <button
                onClick={() => i < step && goStep(i)}
                className={`flex items-center gap-2.5 ${i < step ? 'cursor-pointer' : 'cursor-default'}`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold ${
                    i <= step ? 'bg-brand-gold text-white' : 'bg-line text-text-secondary'
                  }`}
                >
                  {i + 1}
                </span>
                <span
                  className={`text-[14px] font-semibold ${i === step ? 'text-text-primary' : 'text-text-secondary'}`}
                >
                  STEP {i + 1} {s}
                </span>
              </button>
              {i < STEPS.length - 1 && <div className="h-px w-14 bg-line" />}
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-[1fr_380px] gap-8">
          {/* 좌측 스텝 콘텐츠 */}
          <div className="rounded-2xl bg-surface p-8">
            {step === 0 && (
              <StepOptions
                onNext={() => goStep(1)}
              />
            )}
            {step === 1 && <StepBenefits onNext={() => goStep(2)} />}
            {step === 2 && (
              <StepPayment paying={paying} onPay={pay} total={price.total} />
            )}
          </div>

          {/* 우측 실시간 가격 패널 */}
          <aside className="sticky top-24 h-fit rounded-2xl bg-surface p-6">
            <div className="flex gap-3">
              <img src={pkg.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
              <div className="min-w-0">
                <p className="truncate text-[14px] font-bold">{hotel.name}</p>
                <p className="truncate text-[12px] text-text-secondary">{pkg.name}</p>
                <p className="mt-0.5 text-[12px] text-text-secondary">
                  {fmtDay(booking.search.checkIn)} – {fmtDay(booking.search.checkOut)} · 성인{' '}
                  {booking.search.adults}
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-1.5 border-t border-line pt-4">
              <PriceRow label="패키지 기본가" value={`${formatPrice(price.basePrice)}원`} />
              {price.optionItems.map((o) => (
                <PriceRow key={o.name} label={o.name} value={`+${formatPrice(o.price)}원`} />
              ))}
              {step >= 1 && (
                <>
                  <PriceRow label="회원 할인" value={`-${formatPrice(price.memberDiscount)}원`} accent />
                  {price.couponDiscount > 0 && (
                    <PriceRow label="웰컴 쿠폰" value={`-${formatPrice(price.couponDiscount)}원`} accent />
                  )}
                  {price.usedPoints > 0 && (
                    <PriceRow label="포인트 사용" value={`-${formatPrice(price.usedPoints)}원`} accent />
                  )}
                </>
              )}
            </div>
            <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
              <span className="text-[14px] font-semibold">
                {step >= 1 ? '최종 결제 금액' : '현재 합계'}
              </span>
              <span className="text-[24px] font-bold text-brand-gold">
                {formatPrice(step >= 1 ? price.total : price.basePrice + price.optionsTotal)}원
              </span>
            </div>
            {step >= 1 && (
              <p className="mt-1.5 text-right text-[12px] font-medium text-success">
                {formatPrice(price.savedTotal + price.usedPoints)}원 절약 ·{' '}
                {formatPrice(price.expectedPoints)}P 적립 예정
              </p>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}

/* ---------- STEP 1: 옵션 ---------- */

function StepOptions({ onNext }: { onNext: () => void }) {
  const { options, toggleOption, diningTime, setDiningTime } = useBooking()

  return (
    <div>
      <div className="rounded-xl bg-brand-dark px-5 py-4">
        <p className="text-[13px] font-semibold text-brand-gold-light">기념일 추천 옵션</p>
        <p className="mt-0.5 text-[15px] font-bold text-text-inverse">
          더 특별한 경험을 추가해보세요.
        </p>
      </div>

      <div className="mt-2 divide-y divide-line">
        {BOOKING_OPTIONS.map((opt) => {
          const Icon = ICONS[opt.icon] ?? Building2
          const on = options.includes(opt.id)
          return (
            <div key={opt.id} className="py-4">
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cream text-brand-gold">
                  <Icon size={20} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold">
                    {opt.name}
                    {opt.locked && (
                      <span className="ml-1.5 text-[11px] font-medium text-brand-gold">패키지 포함</span>
                    )}
                  </p>
                  <p className="mt-0.5 text-[13px] text-text-secondary">{opt.description}</p>
                </div>
                {opt.price > 0 && (
                  <p className="text-[14px] font-bold text-brand-gold">+{formatPrice(opt.price)}원</p>
                )}
                <Toggle on={on} disabled={opt.locked} onChange={() => toggleOption(opt.id)} />
              </div>
              {opt.id === 'dining-reservation' && on && (
                <div className="mt-3 flex gap-2 pl-[60px]">
                  {DINING_TIMES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setDiningTime(t)}
                      className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                        diningTime === t
                          ? 'border-brand-gold bg-brand-gold text-white'
                          : 'border-line text-text-secondary'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <Button full className="mt-4" onClick={onNext}>
        옵션 확정하고 혜택 적용하기
      </Button>
    </div>
  )
}

/* ---------- STEP 2: 혜택 ---------- */

function StepBenefits({ onNext }: { onNext: () => void }) {
  const member = useAuth((s) => s.member)!
  const { benefits, setBenefits } = useBooking()
  const welcomeCoupon = member.coupons[0]

  return (
    <div>
      {/* 멤버십 카드 */}
      <div className="rounded-2xl bg-brand-dark p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] tracking-[0.15em] text-text-inverse/50">CURRENT TIER</p>
            <p className="text-display mt-1 text-[24px] text-brand-gold-light">Gold Member</p>
          </div>
          <Crown size={24} className="text-brand-gold" />
        </div>
        <div className="mt-5 grid grid-cols-3 gap-4 border-t border-white/10 pt-4">
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
          <div>
            <p className="text-[11px] text-text-inverse/50">회원 전용 할인</p>
            <p className="mt-0.5 text-[17px] font-bold text-brand-gold-light">자동 적용</p>
          </div>
        </div>
      </div>

      {/* 쿠폰 */}
      <div className="mt-6">
        <p className="text-[15px] font-bold">쿠폰 적용</p>
        <div className="mt-2.5 flex items-center justify-between rounded-xl border border-line px-5 py-4">
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

      {/* 포인트 */}
      <div className="mt-6">
        <div className="flex items-baseline justify-between">
          <p className="text-[15px] font-bold">포인트 사용</p>
          <p className="text-[13px] text-text-secondary">
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
            className="cursor-pointer rounded-xl border border-brand-gold px-5 text-[13px] font-semibold text-brand-gold"
          >
            전액 사용
          </button>
        </div>
      </div>

      <Button full className="mt-8" onClick={onNext}>
        혜택 적용하고 결제하기
      </Button>
    </div>
  )
}

/* ---------- STEP 3: 결제 ---------- */

function StepPayment({
  paying,
  onPay,
  total,
}: {
  paying: boolean
  onPay: () => void
  total: number
}) {
  const member = useAuth((s) => s.member)!
  const { paymentMethod, setPaymentMethod } = useBooking()

  return (
    <div>
      {/* 예약자 정보 (자동 채움) */}
      <p className="text-[15px] font-bold">예약자 정보</p>
      <div className="mt-2.5 grid grid-cols-2 gap-3">
        <input
          readOnly
          value={member.name}
          className="h-12 rounded-xl border border-line bg-cream px-4 text-[15px]"
        />
        <input
          readOnly
          value={member.email}
          className="h-12 rounded-xl border border-line bg-cream px-4 text-[15px]"
        />
      </div>
      <p className="mt-1.5 text-[12px] text-text-secondary">
        회원 정보로 자동 입력되었습니다.
      </p>

      {/* 결제 수단 */}
      <p className="mt-7 text-[15px] font-bold">결제 수단</p>
      <div className="mt-2.5 grid grid-cols-2 gap-2.5">
        {METHODS.map((m) => (
          <label
            key={m.id}
            className={`flex cursor-pointer items-center justify-between rounded-xl border px-5 py-4 transition-colors ${
              paymentMethod === m.id ? 'border-brand-gold bg-cream-card/40' : 'border-line'
            }`}
          >
            <span className="text-[14px] font-medium">{m.label}</span>
            <input
              type="radio"
              name="pay"
              checked={paymentMethod === m.id}
              onChange={() => setPaymentMethod(m.id)}
              className="h-4.5 w-4.5 accent-brand-gold"
            />
          </label>
        ))}
      </div>
      {paymentMethod === 'card' && (
        <div className="mt-2.5 flex items-center justify-between rounded-xl bg-cream px-4 py-3">
          <span className="text-[13px] tracking-wider text-text-secondary">
            1234 - **** - **** - 5678
          </span>
          <PencilLine size={15} className="text-text-secondary" />
        </div>
      )}

      {/* 취소 정책 */}
      <div className="mt-6 rounded-xl bg-success/10 px-5 py-4">
        <p className="flex items-center gap-1.5 text-[13px] font-bold text-success">
          <ShieldCheck size={15} />
          무료 취소 가능: 체크인 3일 전까지
        </p>
        <p className="mt-0.5 pl-6 text-[12px] text-text-secondary">
          이후 취소 시 1박 요금이 부과될 수 있습니다.
        </p>
      </div>

      <button
        onClick={onPay}
        disabled={paying}
        className="mt-7 flex h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-gold text-[16px] font-bold text-white disabled:opacity-70"
      >
        {paying && <Loader2 size={18} className="animate-spin" />}
        {paying ? '결제 처리 중...' : `${formatPrice(total)}원 결제하기`}
      </button>
      <p className="mt-2 text-center text-[12px] text-text-secondary">
        예약 완료 시 확인 이메일이 발송됩니다.
      </p>
    </div>
  )
}

function PriceRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between text-[13px]">
      <span className="text-text-secondary">{label}</span>
      <span className={`font-semibold ${accent ? 'text-brand-gold' : ''}`}>{value}</span>
    </div>
  )
}
