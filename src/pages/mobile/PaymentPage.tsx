import { useState } from 'react'
import { useNavigate } from 'react-router'
import { PencilLine, ShieldCheck, Loader2 } from 'lucide-react'
import { AppBar } from '@/components/mobile/AppBar'
import { FixedCta } from '@/components/mobile/FixedCta'
import { Badge } from '@/components/common/Badge'
import { useBooking, calcPrice, formatPrice } from '@/stores/booking'
import { getPackage } from '@/data/packages'
import { getHotel } from '@/data/hotels'
import { fmtDay } from '@/lib/date'
import { format, subDays, parseISO } from 'date-fns'

const METHODS = [
  { id: 'card', label: '신용카드' },
  { id: 'kakaopay', label: '카카오페이' },
  { id: 'naverpay', label: '네이버페이' },
  { id: 'foreign-card', label: '해외카드' },
] as const

export function PaymentPage() {
  const navigate = useNavigate()
  const {
    search,
    hotelId,
    packageId,
    options,
    benefits,
    paymentMethod,
    setPaymentMethod,
    complete,
  } = useBooking()
  const [paying, setPaying] = useState(false)

  const pkg = getPackage(packageId ?? 'anniversary-dining-stay')!
  const hotel = getHotel(hotelId ?? pkg.hotelId)!
  const price = calcPrice(pkg.id, options, benefits)
  const freeCancelUntil = format(subDays(parseISO(search.checkIn), 3), 'M.d')

  const pay = () => {
    setPaying(true)
    // 결제 목업 — 1.5초 로딩 후 완료 화면으로
    setTimeout(() => {
      complete()
      navigate('/mobile/booking/complete')
    }, 1500)
  }

  return (
    <div className="pb-52">
      <AppBar title="결제" />

      {/* 예약 요약 카드 */}
      <div className="mx-5 mt-5 flex gap-3.5 rounded-2xl border border-line p-4">
        <img src={pkg.image} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold">{hotel.name}</p>
          <p className="mt-0.5 truncate text-[12px] text-text-secondary">
            {pkg.name}
            {price.optionItems.length > 0 && ` + ${price.optionItems.map((o) => o.name).join(' · ')}`}
          </p>
          <p className="mt-1 text-[12px] text-text-secondary">
            {fmtDay(search.checkIn)} – {fmtDay(search.checkOut)} · 성인 {search.adults} · 객실 1
          </p>
        </div>
        <button
          onClick={() => navigate('/mobile/booking/options')}
          className="self-start text-[12px] font-semibold text-brand-gold cursor-pointer"
        >
          변경
        </button>
      </div>

      {/* 금액 내역 */}
      <div className="mx-5 mt-5 rounded-2xl border border-line p-5">
        <Row label="패키지 기본가" value={`${formatPrice(price.basePrice)}원`} />
        {price.optionItems.map((o) => (
          <Row key={o.name} label={o.name} value={`+${formatPrice(o.price)}원`} />
        ))}
        <Row label="회원 할인" value={`-${formatPrice(price.memberDiscount)}원`} accent />
        {price.couponDiscount > 0 && (
          <Row label="웰컴 쿠폰 할인" value={`-${formatPrice(price.couponDiscount)}원`} accent />
        )}
        {price.usedPoints > 0 && (
          <Row label="포인트 사용" value={`-${formatPrice(price.usedPoints)}원`} accent />
        )}
        <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
          <span className="text-[14px] font-semibold">최종 결제 금액</span>
          <span className="text-[22px] font-bold text-brand-gold">
            {formatPrice(price.total)}원
          </span>
        </div>
        <div className="mt-2 text-right">
          <Badge tone="cream">
            {formatPrice(price.savedTotal + price.usedPoints)}원 절약 +{' '}
            {formatPrice(price.expectedPoints)}P 예상 적립
          </Badge>
        </div>
      </div>

      {/* 결제 수단 */}
      <div className="mx-5 mt-5">
        <p className="text-[14px] font-bold">결제 수단</p>
        <div className="mt-2.5 divide-y divide-line rounded-2xl border border-line">
          {METHODS.map((m) => (
            <label
              key={m.id}
              className="flex cursor-pointer items-center justify-between px-4 py-3.5"
            >
              <span className="text-[14px]">{m.label}</span>
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
      </div>

      {/* 무료 취소 안내 */}
      <div className="mx-5 mt-5 rounded-xl bg-success/10 px-4 py-3.5">
        <p className="flex items-center gap-1.5 text-[13px] font-bold text-success">
          <ShieldCheck size={15} />
          무료 취소 가능: 체크인 3일 전({freeCancelUntil})까지
        </p>
        <p className="mt-0.5 pl-6 text-[12px] text-text-secondary">
          이후 취소 시 1박 요금이 부과될 수 있습니다.
        </p>
      </div>

      {/* 하단 고정: 혜택 바 + 결제 버튼 */}
      <FixedCta dark>
        <p className="text-center text-[12px] text-brand-gold-light">
          공식 채널 예약 혜택 — 조식 2인 · 포인트 {formatPrice(price.expectedPoints)}P 적립
        </p>
        <button
          onClick={pay}
          disabled={paying}
          className="mt-2 flex h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-gold text-[16px] font-bold text-white disabled:opacity-70"
        >
          {paying && <Loader2 size={18} className="animate-spin" />}
          {paying ? '결제 처리 중...' : `${formatPrice(price.total)}원 결제하기`}
        </button>
        <p className="mt-1.5 text-center text-[11px] text-text-inverse/40">
          예약 완료 시 확인 이메일이 발송됩니다.
        </p>
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
