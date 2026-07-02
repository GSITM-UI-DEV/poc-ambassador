import type { Hotel } from './types'

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`

export const HOTELS: Hotel[] = [
  {
    id: 'grand-pullman-seoul',
    name: '그랜드 앰배서더 서울 풀만',
    nameEn: 'Grand Ambassador Seoul Pullman',
    brand: 'pullman',
    tier: 'PREMIUM',
    region: '서울 · 장충동',
    rating: 4.8,
    tags: ['호캉스', '기념일', '수영장'],
    images: [
      img('photo-1566073771259-6a8506099945'),
      img('photo-1582719508461-905c673771fd'),
      img('photo-1590490360182-c33d57733427'),
      img('photo-1414235077428-338989a2e8c0'),
    ],
    description:
      '남산 자락에 자리한 프리미엄 호텔. 실내 수영장과 파인 다이닝, 기념일을 위한 시그니처 패키지를 갖추고 있습니다.',
    amenities: ['실내 수영장', '피트니스', '조식 뷔페', '발레파킹', '키즈 라운지'],
    lowestPrice: 289000,
  },
  {
    id: 'novotel-gangnam',
    name: '노보텔 앰배서더 강남',
    nameEn: 'Novotel Ambassador Gangnam',
    brand: 'novotel',
    tier: 'LIFESTYLE',
    region: '서울 · 강남',
    rating: 4.6,
    tags: ['비즈니스', '가족여행'],
    images: [
      img('photo-1542314831-068cd1dbfeeb'),
      img('photo-1611892440504-42a792e24d32'),
      img('photo-1544148103-0773bf10d330'),
    ],
    description:
      '강남 한복판의 라이프스타일 호텔. 비즈니스와 가족 여행 모두에 맞는 실용적이고 세련된 공간을 제공합니다.',
    amenities: ['수영장', '피트니스', '조식 뷔페', '비즈니스 라운지'],
    lowestPrice: 195000,
  },
  {
    id: 'ibis-styles-seoul',
    name: '이비스 스타일 앰배서더 서울',
    nameEn: 'ibis Styles Ambassador Seoul',
    brand: 'ibis-styles',
    tier: 'ESSENTIAL',
    region: '서울 · 명동',
    rating: 4.3,
    tags: ['시티투어', '합리적'],
    images: [
      img('photo-1564501049412-61c2a3083791'),
      img('photo-1517840901100-8179e982acb7'),
    ],
    description:
      '명동 중심의 에센셜 호텔. 합리적인 가격으로 도심 여행의 베이스캠프가 되어 드립니다.',
    amenities: ['조식', '셀프 라운드리', '수하물 보관'],
    lowestPrice: 98000,
  },
  {
    id: 'sofitel-ambassador',
    name: '소피텔 앰배서더 서울',
    nameEn: 'Sofitel Ambassador Seoul',
    brand: 'sofitel',
    tier: 'LUXURY',
    region: '서울 · 잠실',
    rating: 4.9,
    tags: ['럭셔리', '기념일', '미식'],
    images: [
      img('photo-1520250497591-112f2f40a3f4'),
      img('photo-1578683010236-d716f9a3f461'),
      img('photo-1551882547-ff40c63fe5fa'),
    ],
    description:
      '프렌치 럭셔리의 정수. 석촌호수 전망과 미쉐린 셰프의 다이닝으로 완성되는 특별한 하루를 선사합니다.',
    amenities: ['인피니티 풀', '스파', '파인 다이닝', '클럽 라운지', '발레파킹'],
    lowestPrice: 420000,
  },
]

export const getHotel = (id: string) => HOTELS.find((h) => h.id === id)

export const TIER_LABEL: Record<Hotel['tier'], { ko: string; desc: string }> = {
  ESSENTIAL: { ko: '이비스 스타일', desc: '합리적인 도심 스테이' },
  LIFESTYLE: { ko: '머큐어 · 노보텔', desc: '일상과 여행의 균형' },
  PREMIUM: { ko: '풀만', desc: '프리미엄 비즈니스 & 호캉스' },
  LUXURY: { ko: '소피텔 · 페어몬트', desc: '럭셔리 컬렉션' },
}
