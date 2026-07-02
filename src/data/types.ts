export type Purpose = 'anniversary' | 'family' | 'dining' | 'workation' | 'business'

export type Tier = 'LUXURY' | 'PREMIUM' | 'LIFESTYLE' | 'ESSENTIAL'

export interface Hotel {
  id: string
  name: string
  nameEn: string
  brand: 'pullman' | 'novotel' | 'ibis-styles' | 'sofitel'
  tier: Tier
  region: string
  rating: number
  tags: string[]
  images: string[]
  description: string
  amenities: string[]
  lowestPrice: number
}

export interface RoomPackage {
  id: string
  hotelId: string
  type: 'room' | 'package'
  name: string
  roomName: string
  includes: string[]
  listPrice: number
  memberPrice: number
  purposes: Purpose[]
  image: string
}

export interface BookingOption {
  id: string
  name: string
  description: string
  price: number
  defaultOn?: boolean
  locked?: boolean // 패키지 포함 항목 — 해제 불가
  icon: string // lucide 아이콘 이름 매핑 키
}

export interface Coupon {
  id: string
  name: string
  amount: number
}

export interface Member {
  name: string
  email: string
  tier: 'GOLD'
  tierDiscountRate: number
  points: number
  expiringPoints: { amount: number; withinDays: number }
  coupons: Coupon[]
  nextTier: { name: 'PLATINUM'; remaining: number }
}

export type ReservationStatus = '예약확정' | '이용완료' | '취소'

export interface Reservation {
  reservationNo: string
  hotelName: string
  packageName: string
  checkIn: string
  checkOut: string
  guests: string
  amount: number
  status: ReservationStatus
  earnedPoints: number
}

export interface Promotion {
  id: string
  title: string
  subtitle: string
  category: '기념일' | '가족' | '비즈니스' | '미식'
  hotelId: string
  benefit: string
  price: number
  period: string
  image: string
}
