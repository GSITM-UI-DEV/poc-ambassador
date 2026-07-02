import { useNavigate } from 'react-router'
import {
  UtensilsCrossed,
  Clock,
  Cake,
  Flower2,
  Building2,
} from 'lucide-react'
import { AppBar } from '@/components/mobile/AppBar'
import { Toggle } from '@/components/mobile/Toggle'
import { FixedCta } from '@/components/mobile/FixedCta'
import { Button } from '@/components/common/Button'
import { BOOKING_OPTIONS, DINING_TIMES } from '@/data/options'
import { useBooking, calcPrice, formatPrice } from '@/stores/booking'

const ICONS: Record<string, React.ComponentType<{ size?: number | string; className?: string }>> = {
  utensils: UtensilsCrossed,
  clock: Clock,
  cake: Cake,
  flower: Flower2,
  building: Building2,
}

export function OptionsPage() {
  const navigate = useNavigate()
  const { packageId, options, toggleOption, diningTime, setDiningTime, benefits } =
    useBooking()
  const price = calcPrice(packageId ?? 'anniversary-dining-stay', options, benefits)
  const baseTotal = price.basePrice + price.optionsTotal

  return (
    <div className="pb-44">
      <AppBar title="옵션 추가" />

      {/* 다크 추천 배너 */}
      <div className="bg-brand-dark px-5 py-4">
        <p className="text-[13px] font-semibold text-brand-gold-light">기념일 추천 옵션</p>
        <p className="mt-0.5 text-[15px] font-bold text-text-inverse">
          더 특별한 경험을 추가해보세요.
        </p>
      </div>

      {/* 옵션 리스트 */}
      <div className="divide-y divide-line">
        {BOOKING_OPTIONS.map((opt) => {
          const Icon = ICONS[opt.icon] ?? Building2
          const on = options.includes(opt.id)
          return (
            <div key={opt.id} className="px-5 py-4">
              <div className="flex items-center gap-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream text-brand-gold">
                  <Icon size={19} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold">
                    {opt.name}
                    {opt.locked && (
                      <span className="ml-1.5 text-[11px] font-medium text-brand-gold">
                        패키지 포함
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 truncate text-[12px] text-text-secondary">
                    {opt.description}
                  </p>
                  {opt.price > 0 && (
                    <p className="mt-0.5 text-[13px] font-bold text-brand-gold">
                      +{formatPrice(opt.price)}원
                    </p>
                  )}
                </div>
                <Toggle on={on} disabled={opt.locked} onChange={() => toggleOption(opt.id)} />
              </div>

              {/* 다이닝 시간 선택 */}
              {opt.id === 'dining-reservation' && on && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1 pl-[54px] [scrollbar-width:none]">
                  {DINING_TIMES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setDiningTime(t)}
                      className={`shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                        diningTime === t
                          ? 'border-brand-gold bg-brand-gold text-white'
                          : 'border-line text-text-secondary'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 하단 합계 + CTA */}
      <FixedCta dark>
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-text-inverse/70">현재 합계</span>
          <span className="text-[20px] font-bold text-text-inverse">
            {formatPrice(baseTotal)}원
          </span>
        </div>
        <p className="mt-0.5 text-right text-[11px] text-text-inverse/50">
          기본 {formatPrice(price.basePrice)}원
          {price.optionItems.map((o) => ` + ${o.name} ${formatPrice(o.price)}원`)}
        </p>
        <Button full className="mt-2.5" onClick={() => navigate('/mobile/booking/benefits')}>
          옵션 확정하고 결제하기
        </Button>
      </FixedCta>
    </div>
  )
}
