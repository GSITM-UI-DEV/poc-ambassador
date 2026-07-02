# 04. 목업 데이터 모델

프로토타입은 백엔드 없이 `src/data/*.ts` 상수로 시연한다. Figma 화면에 등장하는 실제 데이터(그랜드 앰배서더 서울 풀만, Anniversary Dining Stay 345,000원 등)를 그대로 목업에 반영해 화면-데이터 일치를 유지한다.

## Hotel (호텔)

```ts
interface Hotel {
  id: string;              // 'grand-pullman-seoul'
  name: string;            // '그랜드 앰배서더 서울 풀만'
  brand: 'pullman' | 'novotel' | 'ibis-styles' | 'sofitel';
  tier: 'LUXURY' | 'PREMIUM' | 'LIFESTYLE' | 'ESSENTIAL';
  region: string;          // '서울·용산'
  rating: number;          // 4.8
  tags: string[];          // ['호캉스', '기념일']
  images: string[];
  description: string;
  amenities: string[];     // ['키즈풀', '수영장', '조식']
  lowestPrice: number;     // 289000 (회원가 기준 '~부터')
}
```

목업 4개 (Figma 티어 섹션과 일치): 그랜드 앰배서더 서울 풀만 289,000~ / 노보텔 앰배서더 강남 195,000~ / 이비스 스타일 앰배서더 서울 98,000~ / 소피텔 앰배서더 (LUXURY)

## Room / Package (객실·패키지)

```ts
interface RoomPackage {
  id: string;
  hotelId: string;
  type: 'room' | 'package';
  name: string;            // 'Anniversary Dining Stay'
  roomName: string;        // '디럭스 킹'
  includes: string[];      // ['객실 1박', '조식 2인', '다이닝 크레딧 50,000원', '기념일 케이크 메시지']
  listPrice: number;       // 정가 460000
  memberPrice: number;     // 회원가 418000
  purposes: Purpose[];     // ['anniversary']
  image: string;
}
type Purpose = 'anniversary' | 'family' | 'dining' | 'workation' | 'business';
```

## BookingOption (예약 추가 옵션 — 모바일 '옵션 추가' 화면)

```ts
interface BookingOption {
  id: string;
  name: string;            // '기념일 케이크 & 메시지'
  description: string;
  price: number;           // 35000 (0 = 무료)
  defaultOn?: boolean;     // 패키지 포함 항목은 기본 on
}
```

목업: 조식 2인 포함(패키지 포함) / 레스토랑 다이닝 예약(시간 선택) / 기념일 케이크&메시지 +35,000 / 객실 플라워 세팅 +45,000 / 고층부 배정 요청(무료)

## Member (회원 — 로그인 목업 세션)

```ts
interface Member {
  name: string;            // '홍길동'
  tier: 'GOLD';
  tierDiscountRate: 0.15;
  points: number;          // 12350
  expiringPoints: { amount: number; withinDays: number }; // 2000P / 60일
  coupons: Coupon[];       // 웰컴 쿠폰 -10,000원
  nextTier: { name: 'PLATINUM'; remaining: number };      // 잔여 실적
}
```

## Booking (예약 플로우 상태 — zustand)

```ts
interface BookingState {
  hotelId: string;
  packageId: string;
  checkIn: string; checkOut: string;
  guests: { adults: number; children: number };
  options: string[];             // 선택된 BookingOption id
  appliedBenefits: {
    memberDiscount: number;      // -32000
    coupon?: { id: string; amount: number };  // -10000
    usedPoints: number;
  };
  paymentMethod: 'card' | 'kakaopay' | 'naverpay' | 'foreign-card';
  // 완료 시 생성
  reservationNo?: string;        // 'AMB-20250524-8842'
  expectedPoints?: number;       // 3200
}
```

가격 계산: `패키지 기본가 + 옵션 합계 - 회원 할인 - 쿠폰 - 포인트 = 최종 결제 금액` (Figma 결제 화면: 345,000 + 35,000 - 32,000 - 10,000 = 338,000원)

## Reservation (예약 내역 — 마이페이지 TanStack Table)

```ts
interface Reservation {
  reservationNo: string;
  hotelName: string;
  packageName: string;
  checkIn: string; checkOut: string;
  guests: string;          // '성인 2'
  amount: number;
  status: '예약확정' | '이용완료' | '취소';
  earnedPoints: number;
}
```

과거 내역 5~6건 목업 + 방금 완료한 예약이 최상단에 추가되도록.

## Promotion (스페셜 오퍼)

```ts
interface Promotion {
  id: string;
  title: string;           // 'Anniversary Dining Stay'
  category: '기념일' | '가족' | '비즈니스' | '미식';
  hotelId: string;
  benefit: string;         // '레이트 체크아웃 + 다이닝 크레딧'
  price: number;
  period: string;          // '~ 2025.08.31'
  image: string;
}
```
