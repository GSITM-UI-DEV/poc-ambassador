import { useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router'
import { Star, MapPin, Check } from 'lucide-react'
import { Badge } from '@/components/common/Badge'
import { PriceBlock } from '@/components/common/PriceBlock'
import { Button } from '@/components/common/Button'
import { getHotel } from '@/data/hotels'
import { getHotelPackages, PURPOSE_LABEL } from '@/data/packages'
import { useBooking, formatPrice } from '@/stores/booking'
import { fmtDay } from '@/lib/date'

const TABS = ['패키지', '객실', '다이닝'] as const

export function HotelDetailPage() {
  const { hotelId = '' } = useParams()
  const navigate = useNavigate()
  const { search, selectPackage } = useBooking()
  const [tab, setTab] = useState<(typeof TABS)[number]>('패키지')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const hotel = getHotel(hotelId)
  if (!hotel) return <Navigate to="/search" replace />

  const items = getHotelPackages(hotel.id).filter((p) =>
    tab === '패키지' ? p.type === 'package' : p.type === 'room',
  )
  const selected = items.find((p) => p.id === selectedId) ?? items[0]

  return (
    <div>
      {/* 갤러리 */}
      <div className="mx-auto grid max-w-[1280px] grid-cols-[2fr_1fr_1fr] grid-rows-2 gap-2 px-8 pt-6">
        <img
          src={hotel.images[0]}
          alt={hotel.name}
          className="row-span-2 h-full w-full rounded-l-2xl object-cover"
        />
        {[1, 2, 3, 0].map((idx, i) => (
          <img
            key={i}
            src={hotel.images[idx % hotel.images.length]}
            alt=""
            className={`aspect-[4/3] h-full w-full object-cover ${i === 1 ? 'rounded-tr-2xl' : ''} ${i === 3 ? 'rounded-br-2xl' : ''}`}
          />
        ))}
      </div>

      <div className="mx-auto grid max-w-[1280px] grid-cols-[1fr_360px] gap-10 px-8 py-8">
        {/* 좌측 본문 */}
        <div>
          <p className="text-eyebrow text-brand-gold">{hotel.tier}</p>
          <h1 className="mt-1 text-[28px] font-bold">{hotel.name}</h1>
          <p className="mt-2 flex items-center gap-3 text-[14px] text-text-secondary">
            <span className="inline-flex items-center gap-1">
              <MapPin size={14} /> {hotel.region}
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-text-primary">
              <Star size={14} className="fill-brand-gold text-brand-gold" />
              {hotel.rating}
            </span>
          </p>
          <p className="mt-4 max-w-[640px] text-[14px] leading-relaxed text-text-secondary">
            {hotel.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {hotel.amenities.map((a) => (
              <Badge key={a} tone="outline">{a}</Badge>
            ))}
          </div>

          {/* 탭 */}
          <div className="mt-8 flex border-b border-line">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => t !== '다이닝' && setTab(t)}
                className={`-mb-px cursor-pointer border-b-2 px-6 pb-3 text-[16px] font-semibold transition-colors ${
                  tab === t
                    ? 'border-brand-gold text-text-primary'
                    : 'border-transparent text-text-secondary'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {search.purpose && tab === '패키지' && (
            <div className="mt-5 flex w-fit items-center gap-2 rounded-full bg-brand-dark px-4 py-2">
              <Badge tone="gold">{PURPOSE_LABEL[search.purpose]} 목적</Badge>
              <p className="text-[12px] text-text-inverse/80">
                선택하신 목적에 맞는 추천 상품이에요
              </p>
            </div>
          )}

          {/* 상품 카드 */}
          <div className="mt-5 space-y-4">
            {items.map((pkg) => (
              <article
                key={pkg.id}
                onClick={() => setSelectedId(pkg.id)}
                className={`grid cursor-pointer grid-cols-[240px_1fr] overflow-hidden rounded-2xl border-2 transition-colors ${
                  selected?.id === pkg.id ? 'border-brand-gold bg-cream-card/40' : 'border-line'
                }`}
              >
                <img src={pkg.image} alt={pkg.name} className="h-full w-full object-cover" />
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-display text-[19px]">{pkg.name}</h3>
                      <p className="mt-0.5 text-[13px] text-text-secondary">{pkg.roomName}</p>
                    </div>
                    {selected?.id === pkg.id && <Badge tone="gold">선택됨</Badge>}
                  </div>
                  <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5">
                    {pkg.includes.map((inc) => (
                      <li key={inc} className="flex items-center gap-1.5 text-[13px]">
                        <Check size={13} strokeWidth={3} className="shrink-0 text-brand-gold" />
                        {inc}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex items-end justify-between">
                    <div className="flex gap-1.5">
                      <Badge tone="cream">공식혜택</Badge>
                      <Badge tone="cream">무료 취소</Badge>
                    </div>
                    <PriceBlock listPrice={pkg.listPrice} memberPrice={pkg.memberPrice} />
                  </div>
                </div>
              </article>
            ))}
            {items.length === 0 && (
              <p className="py-14 text-center text-[14px] text-text-secondary">
                준비된 상품이 없습니다.
              </p>
            )}
          </div>
        </div>

        {/* 우측 sticky 예약 요약 */}
        <aside className="sticky top-24 h-fit rounded-2xl border border-line p-6">
          <p className="text-[15px] font-bold">예약 요약</p>
          <div className="mt-4 space-y-2.5 text-[13px]">
            <SummaryRow label="일정" value={`${fmtDay(search.checkIn)} – ${fmtDay(search.checkOut)}`} />
            <SummaryRow label="인원" value={`성인 ${search.adults}, 아동 ${search.children}`} />
            <SummaryRow label="선택 상품" value={selected?.name ?? '—'} />
          </div>
          {selected && (
            <div className="mt-5 border-t border-line pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] text-text-secondary">회원가 합계</span>
                <span className="text-[22px] font-bold text-brand-gold">
                  {formatPrice(selected.memberPrice)}원
                </span>
              </div>
              <p className="mt-1 text-right text-[12px] text-text-secondary line-through">
                정가 {formatPrice(selected.listPrice)}원
              </p>
            </div>
          )}
          <Button
            full
            className="mt-5"
            disabled={!selected}
            onClick={() => {
              if (!selected) return
              selectPackage(hotel.id, selected.id)
              navigate('/booking')
            }}
          >
            이 상품으로 예약하기
          </Button>
          <p className="mt-3 text-center text-[12px] text-success">
            체크인 3일 전까지 무료 취소
          </p>
        </aside>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="shrink-0 text-text-secondary">{label}</span>
      <span className="text-right font-semibold">{value}</span>
    </div>
  )
}
