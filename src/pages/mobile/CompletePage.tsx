import { Link, useNavigate } from 'react-router'
import {
  CheckCircle2,
  FileText,
  CalendarPlus,
  MapPin,
  UtensilsCrossed,
  Gift,
} from 'lucide-react'
import { Badge } from '@/components/common/Badge'
import { useBooking, calcPrice, formatPrice } from '@/stores/booking'
import { useAuth } from '@/stores/auth'
import { getPackage } from '@/data/packages'
import { getHotel } from '@/data/hotels'
import { fmtDay } from '@/lib/date'

export function CompletePage() {
  const navigate = useNavigate()
  const member = useAuth((s) => s.member)
  const { search, hotelId, packageId, options, benefits, reservationNo } = useBooking()

  const pkg = getPackage(packageId ?? 'anniversary-dining-stay')!
  const hotel = getHotel(hotelId ?? pkg.hotelId)!
  const price = calcPrice(pkg.id, options, benefits)
  const points = member?.points ?? 12350
  const nextTierRemaining = member?.nextTier.remaining ?? 4350
  const tierProgress = Math.min(
    100,
    Math.round((points / (points + nextTierRemaining)) * 100),
  )

  return (
    <div className="pb-24">
      {/* 완료 헤더 */}
      <div className="flex flex-col items-center px-5 pt-14 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold/15">
          <CheckCircle2 size={36} className="text-brand-gold" />
        </span>
        <h1 className="mt-5 text-[22px] font-bold">예약이 완료되었습니다!</h1>
      </div>

      {/* 다크 예약 카드 */}
      <div className="mx-5 mt-6 rounded-2xl bg-brand-dark p-5">
        <p className="text-[11px] tracking-[0.15em] text-text-inverse/50">예약 번호</p>
        <p className="mt-0.5 text-[17px] font-bold tracking-wide text-brand-gold-light">
          {reservationNo ?? 'AMB-20260724-8842'}
        </p>
        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="text-[17px] font-bold text-text-inverse">{hotel.name}</p>
          <p className="mt-0.5 text-[13px] text-text-inverse/70">{pkg.name}</p>
          <p className="mt-1.5 text-[12px] text-text-inverse/50">
            {fmtDay(search.checkIn)} – {fmtDay(search.checkOut)} · 성인 {search.adults}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {price.optionItems.map((o) => (
              <Badge key={o.name} tone="cream">{o.name} 포함</Badge>
            ))}
            <Badge tone="cream">공식 채널 혜택</Badge>
          </div>
        </div>
      </div>

      {/* 적립 안내 배너 */}
      <div className="mx-5 mt-4 rounded-xl bg-cream-card px-4 py-3.5">
        <p className="text-[13px] font-semibold text-gold-serif">
          이번 예약으로 {formatPrice(price.expectedPoints)}P가 적립될 예정이에요.
        </p>
        <p className="mt-0.5 text-[12px] text-text-secondary">
          적립 후 예상 포인트: {formatPrice(points + price.expectedPoints)}P
        </p>
      </div>

      {/* 액션 3종 */}
      <div className="mx-5 mt-4 grid grid-cols-3 gap-2.5">
        <ActionCard icon={<FileText size={18} />} label="예약 상세" />
        <ActionCard icon={<CalendarPlus size={18} />} label="캘린더 추가" />
        <ActionCard icon={<MapPin size={18} />} label="호텔 길찾기" />
      </div>

      {/* Next Tier 카드 */}
      <div className="mx-5 mt-5 rounded-2xl border border-line p-5">
        <p className="text-[14px] font-semibold leading-relaxed">
          다음 기념일에도 앰배서더가
          <br />
          기억하고 추천해 드릴게요.
        </p>
        <p className="mt-3 text-[12px] text-text-secondary">
          Next Tier: <span className="font-bold text-brand-gold">Platinum</span>{' '}
          ({formatPrice(nextTierRemaining)}P left)
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream-card">
          <div
            className="h-full rounded-full bg-brand-gold"
            style={{ width: `${tierProgress}%` }}
          />
        </div>
        <Link
          to="/mypage"
          className="mt-3.5 inline-block text-[13px] font-semibold text-brand-gold"
        >
          멤버십 혜택 보기 →
        </Link>
      </div>

      {/* 크로스셀 */}
      <div className="mx-5 mt-6">
        <p className="text-[15px] font-bold">이번 숙박을 더 특별하게</p>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <button
            onClick={() => navigate('/mobile/search')}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-line py-3.5 text-[13px] font-semibold"
          >
            <UtensilsCrossed size={16} className="text-brand-gold" />
            다이닝 예약
          </button>
          <button className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-line py-3.5 text-[13px] font-semibold">
            <Gift size={16} className="text-brand-gold" />
            상품권 선물
          </button>
        </div>
      </div>
    </div>
  )
}

function ActionCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border border-line py-3.5">
      <span className="text-brand-gold">{icon}</span>
      <span className="text-[12px] font-semibold">{label}</span>
    </button>
  )
}
