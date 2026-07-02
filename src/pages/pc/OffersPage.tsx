import { useState } from 'react'
import { useNavigate } from 'react-router'
import { BadgeCheck } from 'lucide-react'
import { Badge } from '@/components/common/Badge'
import { PROMOTIONS } from '@/data/promotions'
import { HOTELS, getHotel } from '@/data/hotels'
import { PACKAGES } from '@/data/packages'
import { useBooking, formatPrice } from '@/stores/booking'

const CATEGORIES = ['전체', '기념일', '가족', '미식', '비즈니스'] as const

export function OffersPage() {
  const navigate = useNavigate()
  const { selectPackage } = useBooking()
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('전체')
  const [hotelFilter, setHotelFilter] = useState('all')

  const filtered = PROMOTIONS.filter(
    (p) =>
      (category === '전체' || p.category === category) &&
      (hotelFilter === 'all' || p.hotelId === hotelFilter),
  )

  const book = (promoHotelId: string, promoTitle: string) => {
    // 프로모션 제목과 같은 이름의 패키지가 있으면 그대로 예약 플로우로
    const pkg =
      PACKAGES.find((p) => p.name === promoTitle) ??
      PACKAGES.find((p) => p.hotelId === promoHotelId && p.type === 'package') ??
      PACKAGES[0]
    selectPackage(pkg.hotelId, pkg.id)
    navigate('/booking')
  }

  return (
    <div>
      {/* 헤더 배너 */}
      <div className="bg-brand-dark py-14">
        <div className="mx-auto max-w-[1280px] px-8 text-center">
          <p className="text-eyebrow text-brand-gold-light">SPECIAL OFFERS</p>
          <h1 className="text-display mt-3 text-[36px] text-text-inverse">
            PROMOTIONS &amp; PACKAGES
          </h1>
          <p className="mx-auto mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-dark-soft px-5 py-2 text-[13px] text-brand-gold-light ring-1 ring-white/10">
            <BadgeCheck size={15} />
            공식 채널 전용 — 최저가 보장과 회원 혜택이 함께합니다
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-8 py-10">
        {/* 필터 */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`cursor-pointer rounded-full border px-5 py-2 text-[14px] font-medium transition-colors ${
                  category === c
                    ? 'border-brand-gold bg-brand-gold text-white'
                    : 'border-line text-text-secondary hover:border-brand-gold hover:text-brand-gold'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <select
            value={hotelFilter}
            onChange={(e) => setHotelFilter(e.target.value)}
            className="h-10 cursor-pointer rounded-full border border-line px-4 text-[13px] outline-none"
          >
            <option value="all">전체 호텔</option>
            {HOTELS.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>

        {/* 오퍼 그리드 */}
        <div className="mt-7 grid grid-cols-3 gap-6">
          {filtered.map((promo) => {
            const hotel = getHotel(promo.hotelId)
            return (
              <article
                key={promo.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line transition-shadow hover:shadow-lg"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Badge tone="gold" className="absolute top-3 left-3">
                    {promo.category}
                  </Badge>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[12px] text-text-secondary">{hotel?.name}</p>
                  <h3 className="text-display mt-1 text-[19px]">{promo.title}</h3>
                  <p className="mt-1 text-[13px] text-text-secondary">{promo.subtitle}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <Badge tone="cream">{promo.benefit}</Badge>
                  </div>
                  <div className="mt-auto flex items-end justify-between pt-5">
                    <div>
                      <p className="text-[12px] text-text-secondary">{promo.period}</p>
                      <p className="mt-0.5 text-[18px] font-bold">
                        {formatPrice(promo.price)}원~
                      </p>
                    </div>
                    <button
                      onClick={() => book(promo.hotelId, promo.title)}
                      className="cursor-pointer rounded-full bg-brand-gold px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-gold-light hover:text-brand-dark"
                    >
                      예약하기
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
        {filtered.length === 0 && (
          <p className="py-20 text-center text-[14px] text-text-secondary">
            조건에 맞는 오퍼가 없습니다.
          </p>
        )}
      </div>
    </div>
  )
}
