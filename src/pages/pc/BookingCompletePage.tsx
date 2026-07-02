import { Link, useNavigate } from 'react-router'
import {
  CheckCircle2,
  FileText,
  CalendarPlus,
  UtensilsCrossed,
} from 'lucide-react'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { useBooking, calcPrice, formatPrice } from '@/stores/booking'
import { useAuth } from '@/stores/auth'
import { getPackage } from '@/data/packages'
import { getHotel } from '@/data/hotels'
import { fmtDay } from '@/lib/date'

export function BookingCompletePage() {
  const navigate = useNavigate()
  const member = useAuth((s) => s.member)
  const { search, hotelId, packageId, options, benefits, reservationNo } = useBooking()

  const pkg = getPackage(packageId ?? 'anniversary-dining-stay')!
  const hotel = getHotel(hotelId ?? pkg.hotelId)!
  const price = calcPrice(pkg.id, options, benefits)
  const points = member?.points ?? 12350
  const nextTierRemaining = member?.nextTier.remaining ?? 4350
  const tierProgress = Math.min(100, Math.round((points / (points + nextTierRemaining)) * 100))

  return (
    <div className="bg-cream py-16">
      <div className="mx-auto max-w-[720px] px-8">
        {/* 완료 헤더 */}
        <div className="flex flex-col items-center text-center">
          <span className="flex h-18 w-18 items-center justify-center rounded-full bg-brand-gold/15">
            <CheckCircle2 size={40} className="text-brand-gold" />
          </span>
          <h1 className="mt-5 text-[26px] font-bold">예약이 완료되었습니다!</h1>
          <p className="mt-2 text-[14px] text-text-secondary">
            확인 이메일이 {member?.email ?? '회원 이메일'}로 발송되었습니다.
          </p>
        </div>

        {/* 예약 카드 */}
        <div className="mt-8 rounded-2xl bg-brand-dark p-7">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] tracking-[0.15em] text-text-inverse/50">예약 번호</p>
              <p className="mt-0.5 text-[19px] font-bold tracking-wide text-brand-gold-light">
                {reservationNo ?? 'AMB-20260724-8842'}
              </p>
            </div>
            <Badge tone="gold">예약확정</Badge>
          </div>
          <div className="mt-5 flex gap-4 border-t border-white/10 pt-5">
            <img src={pkg.image} alt="" className="h-20 w-20 rounded-xl object-cover" />
            <div>
              <p className="text-[17px] font-bold text-text-inverse">{hotel.name}</p>
              <p className="mt-0.5 text-[13px] text-text-inverse/70">{pkg.name}</p>
              <p className="mt-1 text-[12px] text-text-inverse/50">
                {fmtDay(search.checkIn)} – {fmtDay(search.checkOut)} · 성인 {search.adults} · 객실 1
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {price.optionItems.map((o) => (
                  <Badge key={o.name} tone="cream">{o.name} 포함</Badge>
                ))}
                <Badge tone="cream">공식 채널 혜택</Badge>
              </div>
            </div>
            <p className="ml-auto self-end text-[20px] font-bold text-text-inverse">
              {formatPrice(price.total)}원
            </p>
          </div>
        </div>

        {/* 적립 + Next Tier */}
        <div className="mt-5 grid grid-cols-2 gap-5">
          <div className="rounded-2xl bg-cream-card p-6">
            <p className="text-[14px] font-bold text-gold-serif">
              {formatPrice(price.expectedPoints)}P 적립 예정
            </p>
            <p className="mt-1 text-[13px] text-text-secondary">
              적립 후 예상 포인트 {formatPrice(points + price.expectedPoints)}P
            </p>
          </div>
          <div className="rounded-2xl bg-surface p-6">
            <p className="text-[13px] text-text-secondary">
              Next Tier: <span className="font-bold text-brand-gold">PLATINUM</span>{' '}
              ({formatPrice(nextTierRemaining)}P left)
            </p>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-cream-card">
              <div className="h-full rounded-full bg-brand-gold" style={{ width: `${tierProgress}%` }} />
            </div>
          </div>
        </div>

        {/* 다음 액션 */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <ActionBtn icon={<FileText size={17} />} label="예약 상세" onClick={() => navigate('/mypage')} />
          <ActionBtn icon={<CalendarPlus size={17} />} label="캘린더 추가" />
          <ActionBtn
            icon={<UtensilsCrossed size={17} />}
            label="다이닝 예약"
            onClick={() => navigate('/offers')}
          />
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <Button onClick={() => navigate('/mypage')}>마이페이지에서 확인</Button>
          <Link
            to="/"
            className="flex h-12 items-center rounded-full border border-line px-6 text-[15px] font-semibold text-text-secondary transition-colors hover:border-brand-gold hover:text-brand-gold"
          >
            메인으로
          </Link>
        </div>
      </div>
    </div>
  )
}

function ActionBtn({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl bg-surface py-5 transition-shadow hover:shadow-md"
    >
      <span className="text-brand-gold">{icon}</span>
      <span className="text-[13px] font-semibold">{label}</span>
    </button>
  )
}
