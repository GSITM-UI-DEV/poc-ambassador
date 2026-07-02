import { useState } from 'react'
import { Link } from 'react-router'
import { Check, Star } from 'lucide-react'
import { Badge } from '@/components/common/Badge'
import { PriceBlock } from '@/components/common/PriceBlock'
import { HOTELS } from '@/data/hotels'
import { PURPOSE_LABEL } from '@/data/packages'
import { useBooking } from '@/stores/booking'
import { fmtDay } from '@/lib/date'

const BRANDS = ['풀만', '노보텔', '이비스 스타일', '소피텔']
const AMENITIES = ['수영장', '키즈풀', '조식', '피트니스', '스파']
const SORTS = ['추천순', '가격 낮은순', '평점 높은순'] as const

export function SearchPage() {
  const { search, setSearch } = useBooking()
  const [sort, setSort] = useState<(typeof SORTS)[number]>('추천순')

  const sorted = [...HOTELS].sort((a, b) => {
    if (sort === '가격 낮은순') return a.lowestPrice - b.lowestPrice
    if (sort === '평점 높은순') return b.rating - a.rating
    return 0
  })

  return (
    <div className="bg-cream">
      {/* 검색 조건 요약 바 */}
      <div className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-8 py-4">
          <div className="flex items-center gap-6 text-[14px]">
            <span className="font-bold">{search.region} 전체</span>
            <span className="text-text-secondary">
              {fmtDay(search.checkIn)} – {fmtDay(search.checkOut)}
            </span>
            <span className="text-text-secondary">
              성인 {search.adults}, 아동 {search.children} · 객실 1
            </span>
          </div>
          <button className="cursor-pointer rounded-full border border-line px-4 py-1.5 text-[13px] font-medium hover:border-brand-gold hover:text-brand-gold">
            조건 변경
          </button>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1280px] grid-cols-[260px_1fr] gap-8 px-8 py-8">
        {/* 좌측 필터 */}
        <aside className="space-y-7 self-start rounded-2xl bg-surface p-6">
          <FilterGroup title="여행 목적">
            <div className="flex flex-wrap gap-2">
              {Object.entries(PURPOSE_LABEL).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSearch({ purpose: search.purpose === key ? null : key })}
                  className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[13px] transition-colors ${
                    search.purpose === key
                      ? 'border-brand-gold bg-brand-gold text-white'
                      : 'border-line text-text-secondary hover:border-brand-gold'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="브랜드">
            {BRANDS.map((b) => (
              <label key={b} className="flex items-center gap-2.5 py-1 text-[14px]">
                <input type="checkbox" defaultChecked className="accent-brand-gold" />
                {b}
              </label>
            ))}
          </FilterGroup>

          <FilterGroup title="가격대 (1박)">
            <input type="range" min={0} max={100} defaultValue={80} className="w-full accent-brand-gold" />
            <p className="mt-1 text-[13px] text-text-secondary">~ 700,000원</p>
          </FilterGroup>

          <FilterGroup title="편의시설">
            {AMENITIES.map((a) => (
              <label key={a} className="flex items-center gap-2.5 py-1 text-[14px]">
                <input type="checkbox" className="accent-brand-gold" />
                {a}
              </label>
            ))}
          </FilterGroup>
        </aside>

        {/* 우측 결과 */}
        <div>
          {/* 혜택 배너 */}
          <div className="flex items-center justify-between rounded-xl bg-cream-card px-5 py-4">
            <div>
              <p className="text-[14px] font-bold text-gold-serif">
                공식 채널 혜택이 있는 호텔 {HOTELS.length * 3}개
              </p>
              <p className="mt-0.5 text-[13px] text-text-secondary">
                회원 혜택 시 최대 42,000원 절약 + 3,200P 적립
              </p>
            </div>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-gold text-white">
              <Check size={13} strokeWidth={3} />
            </span>
          </div>

          {/* 정렬 */}
          <div className="mt-5 flex items-center justify-between">
            <p className="text-[14px] text-text-secondary">호텔 {sorted.length}개</p>
            <div className="flex gap-1.5">
              {SORTS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[13px] transition-colors ${
                    sort === s
                      ? 'bg-brand-dark text-text-inverse'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* 호텔 카드 */}
          <div className="mt-4 space-y-5">
            {sorted.map((h, i) => (
              <article
                key={h.id}
                className="grid grid-cols-[320px_1fr] overflow-hidden rounded-2xl bg-surface"
              >
                <div className="relative">
                  <img src={h.images[0]} alt={h.name} className="h-full w-full object-cover" />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <Badge tone="gold">공식혜택</Badge>
                    {i === 0 && <Badge tone="dark">인기</Badge>}
                  </div>
                </div>
                <div className="flex flex-col p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-eyebrow text-brand-gold">{h.tier}</p>
                      <h3 className="mt-1 text-[20px] font-bold">{h.name}</h3>
                      <p className="mt-1 flex items-center gap-2 text-[13px] text-text-secondary">
                        {h.region}
                        <span className="inline-flex items-center gap-0.5 font-semibold text-text-primary">
                          <Star size={13} className="fill-brand-gold text-brand-gold" />
                          {h.rating}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-1.5">
                    <Badge tone="cream">조식 2인</Badge>
                    <Badge tone="cream">포인트 적립</Badge>
                    <Badge tone="cream">무료 취소</Badge>
                  </div>
                  <div className="mt-auto flex items-end justify-between pt-5">
                    <PriceBlock
                      listPrice={Math.round((h.lowestPrice * 1.18) / 1000) * 1000}
                      memberPrice={h.lowestPrice}
                      align="left"
                    />
                    <Link
                      to={`/hotels/${h.id}`}
                      className="rounded-full bg-brand-gold px-6 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-brand-gold-light hover:text-brand-dark"
                    >
                      객실 보기
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-[14px] font-bold">{title}</p>
      {children}
    </div>
  )
}
