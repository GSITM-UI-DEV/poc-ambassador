import type { BookingOption } from './types'

// 모바일 '옵션 추가' 화면 (Figma 456:514)
export const BOOKING_OPTIONS: BookingOption[] = [
  {
    id: 'breakfast',
    name: '조식 2인',
    description: '패키지에 포함된 항목입니다',
    price: 0,
    defaultOn: true,
    locked: true,
    icon: 'utensils',
  },
  {
    id: 'dining-reservation',
    name: '레스토랑 다이닝 예약',
    description: '다이닝 크레딧으로 이용 · 시간 선택',
    price: 0,
    defaultOn: true,
    icon: 'clock',
  },
  {
    id: 'cake',
    name: '기념일 케이크 & 메시지',
    description: '시그니처 케이크와 축하 메시지 카드',
    price: 35000,
    icon: 'cake',
  },
  {
    id: 'flower',
    name: '객실 플라워 세팅',
    description: '체크인 전 객실에 생화 데코레이션',
    price: 45000,
    icon: 'flower',
  },
  {
    id: 'high-floor',
    name: '고층부 배정 요청',
    description: '현장 상황에 따라 배정 (무료)',
    price: 0,
    icon: 'building',
  },
]

export const DINING_TIMES = ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00']
