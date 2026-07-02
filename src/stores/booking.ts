import { create } from 'zustand'
import { BOOKING_OPTIONS } from '@/data/options'
import { getPackage } from '@/data/packages'
import { MOCK_MEMBER } from '@/data/member'

export interface BookingBenefits {
  memberDiscountOn: boolean
  couponId: string | null
  usedPoints: number
}

export interface SearchCondition {
  region: string
  checkIn: string
  checkOut: string
  adults: number
  children: number
  purpose: string | null
}

interface BookingState {
  search: SearchCondition
  hotelId: string | null
  packageId: string | null
  options: string[] // 선택된 BookingOption id
  diningTime: string
  benefits: BookingBenefits
  paymentMethod: 'card' | 'kakaopay' | 'naverpay' | 'foreign-card'
  reservationNo: string | null

  setSearch: (patch: Partial<SearchCondition>) => void
  selectPackage: (hotelId: string, packageId: string) => void
  toggleOption: (id: string) => void
  setDiningTime: (t: string) => void
  setBenefits: (patch: Partial<BookingBenefits>) => void
  setPaymentMethod: (m: BookingState['paymentMethod']) => void
  complete: () => string
  reset: () => void
}

const initialSearch: SearchCondition = {
  region: '서울',
  checkIn: '2026-07-24',
  checkOut: '2026-07-25',
  adults: 2,
  children: 0,
  purpose: 'anniversary',
}

const initialBenefits: BookingBenefits = {
  memberDiscountOn: true,
  couponId: 'welcome',
  usedPoints: 0,
}

export const useBooking = create<BookingState>((set, get) => ({
  search: initialSearch,
  hotelId: null,
  packageId: null,
  options: BOOKING_OPTIONS.filter((o) => o.defaultOn).map((o) => o.id),
  diningTime: '19:00',
  benefits: initialBenefits,
  paymentMethod: 'card',
  reservationNo: null,

  setSearch: (patch) => set((s) => ({ search: { ...s.search, ...patch } })),
  selectPackage: (hotelId, packageId) =>
    set({
      hotelId,
      packageId,
      options: BOOKING_OPTIONS.filter((o) => o.defaultOn).map((o) => o.id),
      benefits: initialBenefits,
      reservationNo: null,
    }),
  toggleOption: (id) => {
    const opt = BOOKING_OPTIONS.find((o) => o.id === id)
    if (opt?.locked) return
    set((s) => ({
      options: s.options.includes(id)
        ? s.options.filter((x) => x !== id)
        : [...s.options, id],
    }))
  },
  setDiningTime: (t) => set({ diningTime: t }),
  setBenefits: (patch) => set((s) => ({ benefits: { ...s.benefits, ...patch } })),
  setPaymentMethod: (m) => set({ paymentMethod: m }),
  complete: () => {
    const no = `AMB-${get().search.checkIn.replaceAll('-', '')}-${String(
      Math.floor(1000 + Math.random() * 9000),
    )}`
    set({ reservationNo: no })
    return no
  },
  reset: () =>
    set({
      hotelId: null,
      packageId: null,
      options: BOOKING_OPTIONS.filter((o) => o.defaultOn).map((o) => o.id),
      diningTime: '19:00',
      benefits: initialBenefits,
      paymentMethod: 'card',
      reservationNo: null,
    }),
}))

// 가격 계산 — Figma 검증치: 345,000 + 35,000 - 32,000 - 10,000 = 338,000
export interface PriceBreakdown {
  basePrice: number // 패키지 회원가 기준 표시가 (Figma: 345,000)
  listPrice: number // 정가 (460,000)
  optionsTotal: number
  optionItems: { name: string; price: number }[]
  memberDiscount: number // -32,000
  couponDiscount: number
  usedPoints: number
  total: number
  savedTotal: number // "42,000원 절약 중"
  expectedPoints: number // 적립 예정 (총액의 1%)
}

// Figma 화면 수치와 일치시키기 위한 고정 회원 할인액
const MEMBER_DISCOUNT = 32000

export function calcPrice(
  packageId: string | null,
  options: string[],
  benefits: BookingBenefits,
): PriceBreakdown {
  const pkg = packageId ? getPackage(packageId) : undefined
  const basePrice = pkg?.memberPrice ?? 0
  const listPrice = pkg?.listPrice ?? 0

  const optionItems = BOOKING_OPTIONS.filter(
    (o) => options.includes(o.id) && o.price > 0,
  ).map((o) => ({ name: o.name, price: o.price }))
  const optionsTotal = optionItems.reduce((sum, o) => sum + o.price, 0)

  const memberDiscount = benefits.memberDiscountOn ? MEMBER_DISCOUNT : 0
  const coupon = MOCK_MEMBER.coupons.find((c) => c.id === benefits.couponId)
  const couponDiscount = coupon?.amount ?? 0
  const usedPoints = Math.min(benefits.usedPoints, MOCK_MEMBER.points)

  const total = Math.max(
    0,
    basePrice + optionsTotal - memberDiscount - couponDiscount - usedPoints,
  )
  return {
    basePrice,
    listPrice,
    optionsTotal,
    optionItems,
    memberDiscount,
    couponDiscount,
    usedPoints,
    total,
    savedTotal: memberDiscount + couponDiscount,
    // GOLD 적립률 — Figma 결제 화면 수치(338,000원 → 3,200P)와 일치하도록 백 단위 절사
    expectedPoints: Math.floor((total * 0.0095) / 100) * 100,
  }
}

export const formatPrice = (n: number) => n.toLocaleString('ko-KR')
