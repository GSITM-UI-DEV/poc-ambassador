# 03. 디자인 시스템 (design.md)

Figma pc-main(452:309)·모바일 플로우(454:315)에서 추출한 톤&테마.
Figma UI가 아직 빈약하므로 **여기 정의된 토큰이 모든 페이지 스타일링의 기준**이 된다. 디자이너 작업물이 갱신되면 이 문서만 업데이트한다.

## 브랜드 무드

- **럭셔리 호텔 클래식**: 딥 차콜/블랙 배경 위 샴페인 골드 포인트, 크림/아이보리 밝은 섹션 교차
- 영문 디스플레이 타이틀은 세리프(우아함), 국문 본문은 산세리프(가독성)
- 사진이 주인공 — 사진 위 어두운 그라데이션 오버레이 + 밝은 텍스트
- 넉넉한 여백, 얇은 구분선, 낮은 채도. 화려한 그림자·강한 컬러 금지

## 컬러 토큰

| 토큰 | 값 | 용도 |
|---|---|---|
| `brand-gold` | `#B7935B` | 주 액션 버튼, 강조 텍스트, 활성 탭 |
| `brand-gold-light` | `#D4BC8B` | 호버, 배지 배경, 보조 강조 |
| `brand-dark` | `#1C1B19` | 다크 섹션 배경, 헤더/푸터 |
| `brand-dark-soft` | `#2A2825` | 다크 섹션 내 카드 배경 |
| `cream` | `#F7F4EE` | 밝은 섹션 배경 |
| `cream-card` | `#EFE8D8` | 밝은 배경 위 카드(패키지 하이라이트) |
| `surface` | `#FFFFFF` | 기본 페이지 배경, 카드 |
| `text-primary` | `#1C1B19` | 본문 (밝은 배경) |
| `text-secondary` | `#6B6660` | 보조 텍스트, 캡션 |
| `text-inverse` | `#F5F2EA` | 다크 배경 위 텍스트 |
| `text-gold-serif` | `#A8834E` | 세리프 디스플레이 타이틀 |
| `border` | `#E5E0D5` | 구분선, 카드 테두리 |
| `success` | `#2E7D4F` | 무료취소·적립 안내 |
| `danger` | `#C0392B` | 소멸 임박, 취소 |
| `discount` | `#B7935B` | 할인율 표기 (골드 유지 — 빨강 금지) |

## 타이포그래피

| 스케일 | 폰트 | 크기/행간 | 용도 |
|---|---|---|---|
| `display` | Playfair Display 500 | 40/1.2, letter-spacing 0.08em | 영문 섹션 타이틀 ("PROMOTIONS & PACKAGES") |
| `h1` | Pretendard 700 | 32/1.3 | 페이지·히어로 타이틀 |
| `h2` | Pretendard 700 | 24/1.35 | 섹션 타이틀 (국문) |
| `h3` | Pretendard 600 | 18/1.4 | 카드 타이틀 |
| `body` | Pretendard 400 | 15/1.6 | 본문 |
| `caption` | Pretendard 400 | 13/1.5 | 보조 정보, 라벨 |
| `price` | Pretendard 700 | 18~22 | 가격 — 취소선 정가는 caption+line-through |
| `eyebrow` | Pretendard 500 | 12, letter-spacing 0.2em, uppercase | 섹션 위 작은 라벨 ("ESSENTIAL", "LUXURY") |

- 모바일은 각 스케일 -2~-6px 축소 (h1 24, h2 20, body 14)

## 컴포넌트 스타일 규칙

### 버튼
- **Primary**: `brand-gold` 배경 + 흰 텍스트, radius 999px(필 형태), 높이 PC 48 / 모바일 52(풀폭 CTA)
- **Secondary**: 투명 배경 + 1px `brand-gold` 테두리 + 골드 텍스트
- **Dark 섹션용**: `brand-gold` 그대로 사용 (다크 위에서 잘 보임)

### 카드
- radius 12~16px, 테두리 1px `border` (밝은 배경) / 무테두리 (`brand-dark-soft`, 다크 배경)
- 호텔·패키지 카드: 상단 이미지(4:3) + 하단 정보. 태그 배지(작은 필), 가격은 우하단 정렬

### 배지/태그
- 필 형태, 12px, `cream-card` 배경 + `text-gold-serif` 텍스트 (예: "공식혜택", "포인트적립", "무료취소")
- 등급 배지: 골드 배경 + 다크 텍스트 ("GOLD 15%")

### 가격 표기 (제안서 핵심 — 항상 이 형식)
```
정가 460,000원  (취소선, caption, text-secondary)
회원가 418,000원~  (price, text-primary/gold)
-15% GOLD  (등급 배지)
+3,200P 적립 예정  (caption, success)
```

### 폼
- 인풋: 밝은 배경, 1px `border`, radius 8px, 높이 48. 포커스 시 `brand-gold` 테두리
- 검색 위젯(메인): 다크/골드 톤 필 형태 탭(숙박/다이닝/패키지/웨딩·연회) + 필드 그룹 + 골드 검색 버튼

### 모바일 전용
- 상단 AppBar: 뒤로가기 + 타이틀 중앙 + 우측 아이콘, 높이 48
- 하단 BottomNav: 5탭, 중앙 "예약" 탭은 골드 필 강조
- 하단 고정 CTA 바: 합계 금액(좌) + 골드 버튼(우), safe-area 고려
- 결제수단 라디오, 토글 스위치는 골드 활성색

## 섹션 리듬 (PC 메인 기준)

다크 히어로(검색 위젯 오버레이) → 다크 추천 혜택 카드 3종 → 크림 "Promotions & Packages"(세리프 타이틀 + 이미지 캐러셀) → 화이트 멤버십 혜택 → 크림 "숙박을 넘어"(다이닝/웨딩/연회/기업 2×2) → 화이트 호텔 티어 4종(ESSENTIAL/LIFESTYLE/PREMIUM/LUXURY) → 다크 푸터

## 이미지 전략

- 실사진 필요 → **Unsplash 호텔/다이닝/웨딩 카테고리 이미지** placeholder 사용 (프로토용)
- 사진 위 텍스트는 항상 `linear-gradient(rgba(0,0,0,.55), transparent)` 오버레이 후 배치
