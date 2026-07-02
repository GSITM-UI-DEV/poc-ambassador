import { Link, useNavigate } from 'react-router'
import { MapPin, CalendarDays, Users, Heart, ChevronRight } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { FixedCta } from '@/components/mobile/FixedCta'
import { HOTELS } from '@/data/hotels'
import { PURPOSE_LABEL } from '@/data/packages'
import { useBooking, formatPrice } from '@/stores/booking'
import { useAuth } from '@/stores/auth'
import { fmtDay } from '@/lib/date'

const img = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`

const PURPOSE_CARDS = [
  { key: 'anniversary', desc: '케이크 · 다이닝 · 플라워 서비스', imgId: 'photo-1414235077428-338989a2e8c0' },
  { key: 'family', desc: '키즈 라운지 · 조식 · 수영장', imgId: 'photo-1551882547-ff40c63fe5fa' },
  { key: 'dining', desc: '셰프 코스 · 와인 페어링', imgId: 'photo-1544148103-0773bf10d330' },
  { key: 'workation', desc: '레이트 체크아웃 · 라운지', imgId: 'photo-1497366216548-37526070297c' },
]

export function HomePage() {
  const navigate = useNavigate()
  const { search, setSearch } = useBooking()
  const member = useAuth((s) => s.member)

  return (
    <div className="pb-36">
      {/* 다크 히어로 검색 카드 */}
      <section className="relative overflow-hidden bg-brand-dark px-5 pt-12 pb-8">
        <img
          src={img('photo-1519167758481-83f550bb49b3')}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-brand-dark" />
        <div className="relative">
          <h1 className="text-[24px] leading-snug font-bold text-text-inverse">
            오늘의 앰배서더를
            <br />
            찾아보세요
          </h1>
          <p className="mt-2 text-[13px] text-text-inverse/70">
            공식 채널 혜택과 함께 나에게 맞는 호텔을 확인할 수 있어요.
          </p>

          <div className="mt-5 space-y-2.5 rounded-2xl bg-black/35 p-4 backdrop-blur-sm ring-1 ring-white/10">
            <HeroField icon={<MapPin size={15} />} label="지역 · 호텔" value={`${search.region} 전체`} />
            <HeroField
              icon={<CalendarDays size={15} />}
              label="체크인 – 체크아웃"
              value={`${fmtDay(search.checkIn)} – ${fmtDay(search.checkOut)}`}
            />
            <HeroField
              icon={<Users size={15} />}
              label="인원 / 객실"
              value={`성인 ${search.adults}, 아동 ${search.children} / 객실 1`}
            />
            <Button full className="mt-1" onClick={() => navigate('/mobile/search')}>
              혜택 보고 검색하기
            </Button>
          </div>
        </div>
      </section>

      {/* 회원 혜택 배너 */}
      <section className="bg-brand-dark px-5 pb-7">
        <div className="rounded-2xl bg-brand-dark-soft p-5 ring-1 ring-white/5">
          <p className="text-[15px] font-semibold text-text-inverse">
            {member
              ? `${member.name}님, 오늘도 회원 혜택이 준비되어 있어요`
              : '회원으로 예약하면 더 많은 혜택을 받을 수 있어요'}
          </p>
          <div className="mt-3 flex gap-1.5">
            <Badge tone="cream">회원가</Badge>
            <Badge tone="cream">포인트 적립</Badge>
            <Badge tone="cream">전용 쿠폰</Badge>
          </div>
          <Link
            to={member ? '/mobile/booking/benefits' : '/mobile/login'}
            className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-brand-gold-light"
          >
            혜택 확인하기 <ChevronRight size={14} />
          </Link>
        </div>
      </section>

      {/* 목적별 추천 경험 */}
      <section className="px-5 pt-8">
        <h2 className="text-[18px] font-bold">목적별 추천 경험</h2>
        <p className="mt-1 text-[13px] text-text-secondary">
          원하는 경험을 선택하면 맞춤 상품을 추천해드려요.
        </p>
        <div className="-mx-5 mt-4 flex gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none]">
          {PURPOSE_CARDS.map((c) => (
            <button
              key={c.key}
              onClick={() => {
                setSearch({ purpose: c.key })
                navigate('/mobile/search')
              }}
              className="relative h-[190px] w-[140px] shrink-0 cursor-pointer overflow-hidden rounded-2xl text-left"
            >
              <img src={img(c.imgId, 500)} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="img-overlay-bottom absolute inset-0" />
              <div className="absolute inset-x-0 bottom-0 p-3.5">
                <p className="text-[16px] font-bold text-white">{PURPOSE_LABEL[c.key]}</p>
                <p className="mt-0.5 text-[11px] leading-snug text-white/75">{c.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 추천 호텔 */}
      <section className="px-5 pt-8">
        <h2 className="text-[18px] font-bold">추천 호텔</h2>
        <div className="mt-4 space-y-5">
          {HOTELS.slice(0, 2).map((h) => (
            <Link
              key={h.id}
              to={`/mobile/hotels/${h.id}`}
              className="block overflow-hidden rounded-2xl border border-line"
            >
              <div className="relative">
                <img src={h.images[0]} alt={h.name} className="aspect-[16/10] w-full object-cover" />
                <button className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur">
                  <Heart size={17} />
                </button>
              </div>
              <div className="p-4">
                <p className="text-[12px] font-medium text-brand-gold">{h.region}</p>
                <h3 className="mt-0.5 text-[17px] font-bold">{h.name}</h3>
                <div className="mt-2 flex gap-1.5">
                  {h.tags.slice(0, 2).map((t) => (
                    <Badge key={t} tone="outline">{t}</Badge>
                  ))}
                </div>
                <p className="mt-3 text-right">
                  <span className="text-[12px] text-text-secondary">회원가 </span>
                  <span className="text-[18px] font-bold">{formatPrice(h.lowestPrice)}원~</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 하단 고정 바 */}
      <FixedCta dark>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[12px] text-text-inverse/60">
              {fmtDay(search.checkIn)} – {fmtDay(search.checkOut)} · 성인 {search.adults}
            </p>
            <p className="text-[13px] font-semibold text-text-inverse">지금 조건으로 확인해보세요</p>
          </div>
          <Button size="sm" onClick={() => navigate('/mobile/search')}>
            혜택 보고 예약
          </Button>
        </div>
      </FixedCta>
    </div>
  )
}

function HeroField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3.5 py-2.5">
      <span className="text-brand-gold-light">{icon}</span>
      <div>
        <p className="text-[10px] text-text-inverse/50">{label}</p>
        <p className="text-[14px] font-semibold text-text-inverse">{value}</p>
      </div>
    </div>
  )
}
