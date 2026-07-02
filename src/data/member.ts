import type { Member } from './types'

// 목업 로그인 세션 — 어떤 입력이든 이 회원으로 로그인된다
export const MOCK_MEMBER: Member = {
  name: '홍길동',
  email: 'hong@ambatel.com',
  tier: 'GOLD',
  tierDiscountRate: 0.15,
  points: 12350,
  expiringPoints: { amount: 2000, withinDays: 60 },
  coupons: [
    { id: 'welcome', name: '웰컴 쿠폰', amount: 10000 },
    { id: 'birthday', name: '생일 축하 쿠폰', amount: 15000 },
  ],
  nextTier: { name: 'PLATINUM', remaining: 4350 },
}
