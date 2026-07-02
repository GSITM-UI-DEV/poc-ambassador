import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Heart, Star, Check, ChevronLeft } from 'lucide-react'
import { Badge } from '@/components/common/Badge'
import { PriceBlock } from '@/components/common/PriceBlock'
import { getHotel } from '@/data/hotels'
import { getHotelPackages, PURPOSE_LABEL } from '@/data/packages'
import { useBooking } from '@/stores/booking'

const TABS = ['객실', '패키지', '다이닝'] as const

export function HotelDetailPage() {
  const { hotelId = '' } = useParams()
  const navigate = useNavigate()
  const { search, selectPackage } = useBooking()
  const hotel = getHotel(hotelId)
  const [tab, setTab] = useState<(typeof TABS)[number]>('패키지')

  if (!hotel) {
    navigate('/mobile', { replace: true })
    return null
  }

  const items = getHotelPackages(hotel.id).filter((p) =>
    tab === '패키지' ? p.type === 'package' : p.type === 'room',
  )

  return (
    <div className="pb-24">
      {/* 상단 사진 + 오버레이 내비 */}
      <div className="relative">
        <img src={hotel.images[0]} alt={hotel.name} className="aspect-[4/3] w-full object-cover" />
        <div className="img-overlay absolute inset-0" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 left-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/30 text-white backdrop-blur"
          aria-label="뒤로가기"
        >
          <ChevronLeft size={20} />
        </button>
        <button className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur">
          <Heart size={17} />
        </button>
      </div>

      <div className="px-5 pt-5">
        <h1 className="text-[21px] font-bold">{hotel.name}</h1>
        <p className="mt-1 flex items-center gap-1.5 text-[13px] text-text-secondary">
          {hotel.region}
          <span className="inline-flex items-center gap-0.5 font-semibold text-text-primary">
            <Star size={13} className="fill-brand-gold text-brand-gold" />
            {hotel.rating}
          </span>
        </p>
      </div>

      {/* 탭 */}
      <div className="mt-5 flex border-b border-line px-5">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => t !== '다이닝' && setTab(t)}
            className={`-mb-px cursor-pointer border-b-2 px-4 pb-2.5 text-[15px] font-semibold transition-colors ${
              tab === t
                ? 'border-brand-gold text-text-primary'
                : 'border-transparent text-text-secondary'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* 목적 추천 안내 칩 */}
      {search.purpose && tab === '패키지' && (
        <div className="mx-5 mt-4 flex items-center gap-2 rounded-full bg-brand-dark px-4 py-2">
          <Badge tone="gold">{PURPOSE_LABEL[search.purpose]} 목적</Badge>
          <p className="text-[12px] text-text-inverse/80">
            선택하신 목적에 맞는 추천 패키지를 보여드려요
          </p>
        </div>
      )}

      {/* 패키지/객실 카드 */}
      <div className="mt-4 space-y-4 px-5">
        {items.map((pkg) => (
          <article key={pkg.id} className="rounded-2xl bg-cream-card p-5">
            <h3 className="text-display text-[19px] text-text-primary">{pkg.name}</h3>
            <ul className="mt-3.5 space-y-2">
              {pkg.includes.map((inc) => (
                <li key={inc} className="flex items-center gap-2 text-[13px]">
                  <Check size={14} strokeWidth={3} className="shrink-0 text-brand-gold" />
                  {inc}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-1.5">
              <Badge tone="gold">공식혜택</Badge>
              <Badge tone="outline" className="bg-white">포인트 적립</Badge>
              <Badge tone="outline" className="bg-white">무료 취소</Badge>
            </div>
            <div className="mt-5 border-t border-brand-gold/20 pt-4">
              <PriceBlock listPrice={pkg.listPrice} memberPrice={pkg.memberPrice} size="lg" />
            </div>
            <button
              onClick={() => {
                selectPackage(hotel.id, pkg.id)
                navigate('/mobile/booking/options')
              }}
              className="mt-4 h-12 w-full cursor-pointer rounded-full bg-brand-gold text-[15px] font-semibold text-white transition-colors hover:bg-brand-gold-light hover:text-brand-dark"
            >
              {pkg.type === 'package' ? '패키지 선택하기' : '객실 선택하기'}
            </button>
          </article>
        ))}
        {items.length === 0 && (
          <p className="py-10 text-center text-[13px] text-text-secondary">
            준비된 상품이 없습니다.
          </p>
        )}
      </div>
    </div>
  )
}
