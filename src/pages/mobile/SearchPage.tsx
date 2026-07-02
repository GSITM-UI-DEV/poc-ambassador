import { Link } from 'react-router'
import { Check } from 'lucide-react'
import { AppBar } from '@/components/mobile/AppBar'
import { Badge } from '@/components/common/Badge'
import { PriceBlock } from '@/components/common/PriceBlock'
import { HOTELS } from '@/data/hotels'
import { PURPOSE_LABEL } from '@/data/packages'
import { useBooking } from '@/stores/booking'
import { fmtDay } from '@/lib/date'

export function SearchPage() {
  const { search, setSearch } = useBooking()
  const filtered = search.purpose
    ? [...HOTELS].sort((a, b) =>
        a.tags.includes(PURPOSE_LABEL[search.purpose!]) ===
        b.tags.includes(PURPOSE_LABEL[search.purpose!])
          ? 0
          : a.tags.includes(PURPOSE_LABEL[search.purpose!])
            ? -1
            : 1,
      )
    : HOTELS

  return (
    <div className="pb-20">
      <AppBar title="검색 결과" />

      {/* 조건 요약 바 */}
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <p className="text-[13px] font-medium">
          {search.region} · {fmtDay(search.checkIn)}–{fmtDay(search.checkOut)} · 성인{' '}
          {search.adults}명
        </p>
        <button className="rounded-full border border-line px-3 py-1 text-[12px] text-text-secondary cursor-pointer">
          조건 변경
        </button>
      </div>

      {/* 혜택 안내 배너 */}
      <div className="mx-5 mt-4 flex items-start justify-between rounded-xl bg-cream-card px-4 py-3.5">
        <div>
          <p className="text-[13px] font-bold text-gold-serif">
            공식 채널 혜택이 있는 호텔 {HOTELS.length * 3}개
          </p>
          <p className="mt-0.5 text-[12px] text-text-secondary">
            회원 혜택 시 최대 42,000원 절약 + 3,200P 적립
          </p>
        </div>
        <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold text-white">
          <Check size={12} strokeWidth={3} />
        </span>
      </div>

      {/* 목적 칩 */}
      <div className="mt-4 px-5">
        <p className="text-[13px] font-semibold">이런 경험을 찾고 계신가요?</p>
        <div className="-mx-5 mt-2.5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none]">
          <Chip label="전체" active={!search.purpose} onClick={() => setSearch({ purpose: null })} />
          {Object.entries(PURPOSE_LABEL).map(([key, label]) => (
            <Chip
              key={key}
              label={label}
              active={search.purpose === key}
              onClick={() => setSearch({ purpose: key })}
            />
          ))}
        </div>
      </div>

      {/* 호텔 카드 리스트 */}
      <div className="mt-4 space-y-5 px-5">
        {filtered.map((h, i) => (
          <article key={h.id} className="overflow-hidden rounded-2xl border border-line">
            <div className="relative">
              <img src={h.images[0]} alt={h.name} className="aspect-[16/9] w-full object-cover" />
              <div className="absolute top-3 left-3 flex gap-1.5">
                <Badge tone="gold">공식혜택</Badge>
                {i === 0 && <Badge tone="dark">인기</Badge>}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-[17px] font-bold">{h.name}</h3>
              <p className="mt-0.5 text-[12px] text-text-secondary">{h.region}</p>
              <div className="mt-2.5 flex gap-1.5">
                <Badge tone="cream">조식 2인</Badge>
                <Badge tone="cream">포인트 적립</Badge>
                <Badge tone="cream">무료 취소</Badge>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <PriceBlock
                  listPrice={Math.round((h.lowestPrice * 1.18) / 1000) * 1000}
                  memberPrice={h.lowestPrice}
                  align="left"
                  size="sm"
                  showEarn={false}
                />
                <Link
                  to={`/mobile/hotels/${h.id}`}
                  className="rounded-full bg-brand-gold px-5 py-2 text-[13px] font-semibold text-white"
                >
                  객실 보기
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 cursor-pointer rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors ${
        active
          ? 'border-brand-gold bg-brand-gold text-white'
          : 'border-line text-text-secondary'
      }`}
    >
      {label}
    </button>
  )
}
