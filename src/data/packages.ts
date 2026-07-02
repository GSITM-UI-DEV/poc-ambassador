import type { RoomPackage } from './types'

const img = (id: string, w = 1000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`

export const PACKAGES: RoomPackage[] = [
  {
    id: 'anniversary-dining-stay',
    hotelId: 'grand-pullman-seoul',
    type: 'package',
    name: 'Anniversary Dining Stay',
    roomName: '디럭스 킹',
    includes: ['객실 1박', '조식 2인', '다이닝 크레딧 50,000원', '기념일 케이크 메시지 카드'],
    listPrice: 460000,
    memberPrice: 345000,
    purposes: ['anniversary', 'dining'],
    image: img('photo-1414235077428-338989a2e8c0'),
  },
  {
    id: 'family-resort-package',
    hotelId: 'grand-pullman-seoul',
    type: 'package',
    name: 'Family Resort Package',
    roomName: '패밀리 트윈',
    includes: ['객실 1박', '조식 2인 + 어린이 1인', '키즈 라운지 이용권', '레이트 체크아웃 (13시)'],
    listPrice: 380000,
    memberPrice: 298000,
    purposes: ['family'],
    image: img('photo-1566073771259-6a8506099945'),
  },
  {
    id: 'business-premier-stay',
    hotelId: 'novotel-gangnam',
    type: 'package',
    name: 'Business Premier Stay',
    roomName: '프리미어 킹',
    includes: ['객실 1박', '조식 1인', '라운지 이용', '익스프레스 체크인/아웃'],
    listPrice: 260000,
    memberPrice: 209000,
    purposes: ['business', 'workation'],
    image: img('photo-1611892440504-42a792e24d32'),
  },
  {
    id: 'deluxe-king',
    hotelId: 'grand-pullman-seoul',
    type: 'room',
    name: '디럭스 킹',
    roomName: '디럭스 킹',
    includes: ['객실 1박', '무료 Wi-Fi', '피트니스 이용'],
    listPrice: 340000,
    memberPrice: 289000,
    purposes: ['business'],
    image: img('photo-1582719508461-905c673771fd'),
  },
  {
    id: 'executive-suite',
    hotelId: 'grand-pullman-seoul',
    type: 'room',
    name: '이그제큐티브 스위트',
    roomName: '이그제큐티브 스위트',
    includes: ['객실 1박', '클럽 라운지', '조식 2인', '해피아워'],
    listPrice: 620000,
    memberPrice: 527000,
    purposes: ['anniversary'],
    image: img('photo-1590490360182-c33d57733427'),
  },
  {
    id: 'sofitel-luxury-escape',
    hotelId: 'sofitel-ambassador',
    type: 'package',
    name: 'Luxury Escape',
    roomName: '럭셔리 킹 (레이크뷰)',
    includes: ['객실 1박', '조식 2인', '스파 크레딧 100,000원', '샴페인 웰컴 어메니티'],
    listPrice: 680000,
    memberPrice: 561000,
    purposes: ['anniversary', 'dining'],
    image: img('photo-1520250497591-112f2f40a3f4'),
  },
  {
    id: 'ibis-city-stay',
    hotelId: 'ibis-styles-seoul',
    type: 'room',
    name: '스탠다드 더블',
    roomName: '스탠다드 더블',
    includes: ['객실 1박', '무료 Wi-Fi'],
    listPrice: 120000,
    memberPrice: 98000,
    purposes: ['business'],
    image: img('photo-1517840901100-8179e982acb7'),
  },
]

export const getPackage = (id: string) => PACKAGES.find((p) => p.id === id)
export const getHotelPackages = (hotelId: string) =>
  PACKAGES.filter((p) => p.hotelId === hotelId)

export const PURPOSE_LABEL: Record<string, string> = {
  anniversary: '기념일',
  family: '가족여행',
  dining: '미식',
  workation: '워케이션',
  business: '출장',
}
