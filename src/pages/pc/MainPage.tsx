import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import useEmblaCarousel from 'embla-carousel-react'
import {
  MapPin,
  CalendarDays,
  Users,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { HOTELS, TIER_LABEL } from '@/data/hotels'
import { PACKAGES, PURPOSE_LABEL } from '@/data/packages'
import { useBooking, formatPrice } from '@/stores/booking'
import { useAuth } from '@/stores/auth'

const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`

/* ---------- 히어로 + 검색 위젯 ---------- */

const SEARCH_TABS = ['숙박', '다이닝', '패키지', '웨딩 · 연회']

function HeroSearch() {
  const navigate = useNavigate()
  const { search, setSearch } = useBooking()
  const [tab, setTab] = useState(0)

  return (
    <section className="relative flex min-h-[680px] flex-col justify-end bg-brand-dark">
      <img
        src={img('photo-1519167758481-83f550bb49b3')}
        alt="앰배서더 호텔 로비"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-brand-dark" />

      <div className="relative mx-auto w-full max-w-[1280px] px-8 pt-40 pb-16">
        <h1 className="max-w-[560px] text-[40px] leading-[1.25] font-bold text-text-inverse">
          당신의 일정에 맞는
          <br />
          앰배서더 경험을 찾아보세요
        </h1>
        <p className="mt-4 max-w-[520px] text-[15px] text-text-inverse/70">
          호캉스, 기념일, 가족여행까지. 공식 채널에서 예약하면 더 큰 혜택이 함께합니다.
        </p>

        {/* 검색 위젯 */}
        <div className="mt-10 overflow-hidden rounded-2xl bg-brand-dark-soft/90 ring-1 ring-white/10 backdrop-blur-sm">
          <div className="flex">
            {SEARCH_TABS.map((t, i) => (
              <button
                key={t}
                onClick={() => setTab(i)}
                className={`h-12 flex-1 cursor-pointer text-[14px] font-semibold transition-colors ${
                  tab === i
                    ? 'bg-brand-gold text-white'
                    : 'text-text-inverse/60 hover:text-text-inverse'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 px-6 py-5">
            <Field
              icon={<MapPin size={16} />}
              label="지역 · 호텔"
              value={`${search.region} 전체`}
            />
            <Divider />
            <Field
              icon={<CalendarDays size={16} />}
              label="체크인 – 체크아웃"
              value={`${search.checkIn.slice(5).replace('-', '.')} – ${search.checkOut.slice(5).replace('-', '.')}`}
            />
            <Divider />
            <Field
              icon={<Users size={16} />}
              label="인원"
              value={`성인 ${search.adults}, 아동 ${search.children}`}
            />
            <Button className="min-w-[180px]" onClick={() => navigate('/search')}>
              혜택 보고 검색하기
            </Button>
          </div>
        </div>

        {/* 목적 칩 */}
        <div className="mt-6 flex items-center gap-2.5">
          <span className="text-[13px] text-text-inverse/50">이런 목적은 어떠세요?</span>
          {Object.entries(PURPOSE_LABEL).map(([key, label]) => (
            <button
              key={key}
              onClick={() => {
                setSearch({ purpose: key })
                navigate('/search')
              }}
              className={`cursor-pointer rounded-full border px-4 py-1.5 text-[13px] transition-colors ${
                search.purpose === key
                  ? 'border-brand-gold bg-brand-gold text-white'
                  : 'border-white/25 text-text-inverse/80 hover:border-brand-gold-light hover:text-brand-gold-light'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function Field({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex flex-1 items-center gap-3 px-2">
      <span className="text-brand-gold">{icon}</span>
      <div>
        <p className="text-[11px] text-text-inverse/50">{label}</p>
        <p className="text-[15px] font-semibold text-text-inverse">{value}</p>
      </div>
    </div>
  )
}

const Divider = () => <div className="h-9 w-px bg-white/10" />

/* ---------- 추천 혜택 (다크) ---------- */

function FeaturedOffers() {
  const navigate = useNavigate()
  const { selectPackage } = useBooking()
  const featured = PACKAGES.filter((p) => p.type === 'package').slice(0, 3)

  return (
    <section className="bg-brand-dark py-24">
      <div className="mx-auto max-w-[1280px] px-8">
        <p className="text-eyebrow text-center text-brand-gold-light">OFFICIAL BENEFITS</p>
        <h2 className="mt-3 text-center text-[26px] font-bold text-text-inverse">
          공식 채널에서만 만나는 추천 혜택
        </h2>

        <div className="mt-12 grid grid-cols-3 gap-6">
          {featured.map((pkg) => {
            const hotel = HOTELS.find((h) => h.id === pkg.hotelId)
            return (
              <article
                key={pkg.id}
                className="flex flex-col rounded-2xl bg-brand-dark-soft p-7 ring-1 ring-white/5"
              >
                <p className="text-[12px] text-text-inverse/50">{hotel?.name}</p>
                <h3 className="text-display mt-2 text-[19px] text-text-inverse">
                  {pkg.name}
                </h3>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {pkg.includes.slice(0, 3).map((inc) => (
                    <Badge key={inc} tone="cream">
                      {inc}
                    </Badge>
                  ))}
                </div>
                <div className="mt-auto flex items-end justify-between pt-8">
                  <div>
                    <p className="text-[12px] text-text-inverse/40 line-through">
                      {formatPrice(pkg.listPrice)}원
                    </p>
                    <p className="text-[20px] font-bold text-brand-gold-light">
                      {formatPrice(pkg.memberPrice)}원~
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      selectPackage(pkg.hotelId, pkg.id)
                      navigate('/booking')
                    }}
                  >
                    예약하기
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------- Promotions & Packages (크림, 세리프 + 캐러셀) ---------- */

function PromotionsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: true })
  const slides = PACKAGES.slice(0, 6)

  return (
    <section className="bg-cream py-24">
      <div className="mx-auto max-w-[1280px] px-8 text-center">
        <p className="text-eyebrow text-gold-serif">AMBASSADOR</p>
        <h2 className="text-display mt-3 text-[40px] text-gold-serif">
          PROMOTIONS &amp; PACKAGES
        </h2>
        <p className="mx-auto mt-5 max-w-[560px] text-[14px] leading-relaxed text-text-secondary">
          계절의 미식, 기념일의 설렘, 가족의 웃음까지. 앰배서더가 준비한 시즌
          프로모션과 패키지로 하루를 완성해 보세요.
        </p>
        <Link
          to="/offers"
          className="mt-4 inline-block text-[13px] font-semibold text-brand-gold hover:underline"
        >
          전체 오퍼 보기 →
        </Link>
      </div>

      <div className="relative mx-auto mt-12 max-w-[1280px] px-8">
        <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
          <div className="flex gap-5">
            {slides.map((pkg) => (
              <Link
                key={pkg.id}
                to={`/hotels/${pkg.hotelId}`}
                className="group relative min-w-0 flex-[0_0_31%] overflow-hidden rounded-2xl"
              >
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="img-overlay-bottom absolute inset-0" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-left">
                  <p className="text-display text-[17px] text-white">{pkg.name}</p>
                  <p className="mt-1 text-[13px] text-white/70">
                    {formatPrice(pkg.memberPrice)}원~
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <CarouselArrow dir="prev" onClick={() => emblaApi?.scrollPrev()} />
        <CarouselArrow dir="next" onClick={() => emblaApi?.scrollNext()} />
      </div>
    </section>
  )
}

function CarouselArrow({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
  const Icon = dir === 'prev' ? ChevronLeft : ChevronRight
  return (
    <button
      onClick={onClick}
      aria-label={dir}
      className={`absolute top-1/2 -translate-y-1/2 ${dir === 'prev' ? 'left-2' : 'right-2'} flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/90 text-text-primary shadow-md transition hover:bg-brand-gold hover:text-white`}
    >
      <Icon size={20} />
    </button>
  )
}

/* ---------- 멤버십 혜택 ---------- */

const MEMBERSHIP_BENEFITS = [
  '회원 전용가 최대 15% 할인',
  '결제 금액의 최대 5% 포인트 적립',
  '숙박 실적에 따른 등급 업그레이드',
  '기념일 케어 — 축하 케이크 · 레이트 체크아웃',
]

function MembershipSection() {
  const navigate = useNavigate()
  const member = useAuth((s) => s.member)

  return (
    <section className="bg-surface py-24">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 items-center gap-16 px-8">
        <div>
          <p className="text-eyebrow text-brand-gold">AMBASSADOR MEMBERSHIP</p>
          <h2 className="mt-3 text-[30px] leading-snug font-bold">
            앰배서더를 이용할수록
            <br />
            커지는 나의 혜택
          </h2>
          <ul className="mt-8 space-y-4">
            {MEMBERSHIP_BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-3 text-[15px]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
                  <Check size={14} strokeWidth={3} />
                </span>
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex gap-3">
            {member ? (
              <Button onClick={() => navigate('/mypage')}>나의 멤버십 보기</Button>
            ) : (
              <Button onClick={() => navigate('/login')}>회원가입</Button>
            )}
            <Button variant="secondary" onClick={() => navigate('/mypage')}>
              멤버십 혜택 보기
            </Button>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={img('photo-1520250497591-112f2f40a3f4', 1200)}
            alt="멤버십"
            className="aspect-[4/3] w-full object-cover"
          />
          <div className="absolute right-5 bottom-5 rounded-xl bg-brand-dark/85 px-5 py-4 backdrop-blur">
            <p className="text-[11px] tracking-[0.2em] text-brand-gold-light">GOLD MEMBER</p>
            <p className="mt-1 text-[14px] font-semibold text-text-inverse">
              회원가 -15% · 적립 5%
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- 완성하는 하루 (2×2) ---------- */

const EXPERIENCES = [
  { title: '다이닝', desc: '셰프의 계절 미식', cta: '레스토랑 둘러보기', imgId: 'photo-1414235077428-338989a2e8c0' },
  { title: '웨딩', desc: '가장 빛나는 순간', cta: '웨딩 상담 신청', imgId: 'photo-1519741497674-611481863552' },
  { title: '연회', desc: '품격 있는 모임', cta: '연회장 보기', imgId: 'photo-1511578314322-379afb476865' },
  { title: '기업 행사', desc: '성공적인 비즈니스', cta: '기업 행사 문의', imgId: 'photo-1497366216548-37526070297c' },
]

function ExperienceSection() {
  return (
    <section className="bg-cream py-24">
      <div className="mx-auto max-w-[1280px] px-8">
        <h2 className="text-center text-[26px] font-bold">
          숙박을 넘어, 앰배서더에서 완성하는 하루
        </h2>
        <div className="mt-12 grid grid-cols-2 gap-6">
          {EXPERIENCES.map((e) => (
            <Link
              key={e.title}
              to="/offers"
              className="group relative overflow-hidden rounded-2xl"
            >
              <img
                src={img(e.imgId, 1200)}
                alt={e.title}
                className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="img-overlay-bottom absolute inset-0" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-7">
                <div>
                  <h3 className="text-[22px] font-bold text-white">{e.title}</h3>
                  <p className="text-[13px] text-white/70">{e.desc}</p>
                </div>
                <span className="rounded-full bg-white/15 px-4 py-1.5 text-[12px] font-medium text-white backdrop-blur transition-colors group-hover:bg-brand-gold">
                  {e.cta} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- 호텔 티어 ---------- */

function HotelTierSection() {
  return (
    <section className="bg-surface py-24">
      <div className="mx-auto max-w-[1280px] px-8">
        <h2 className="text-center text-[26px] font-bold">
          목적과 예산에 맞는 앰배서더 호텔을 찾아보세요
        </h2>
        <div className="mt-12 grid grid-cols-4 gap-6">
          {(['ESSENTIAL', 'LIFESTYLE', 'PREMIUM', 'LUXURY'] as const).map((tier) => {
            const hotel = HOTELS.find((h) => h.tier === tier)
            return (
              <article key={tier} className="flex flex-col">
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={hotel?.images[0]}
                    alt={TIER_LABEL[tier].ko}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <p className="text-eyebrow mt-5 text-brand-gold">{tier}</p>
                <h3 className="mt-1 text-[18px] font-bold">{TIER_LABEL[tier].ko}</h3>
                <p className="mt-1 text-[13px] text-text-secondary">
                  {TIER_LABEL[tier].desc}
                </p>
                <Link
                  to={hotel ? `/hotels/${hotel.id}` : '/search'}
                  className="mt-4 inline-flex w-fit items-center rounded-full border border-line px-5 py-2 text-[13px] font-semibold transition-colors hover:border-brand-gold hover:text-brand-gold"
                >
                  호텔 보기
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function MainPage() {
  return (
    <>
      <HeroSearch />
      <FeaturedOffers />
      <PromotionsCarousel />
      <MembershipSection />
      <ExperienceSection />
      <HotelTierSection />
    </>
  )
}
