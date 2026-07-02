# 01. 기술 스택

## 확정 (사용자 지정)

| 영역 | 선택 | 비고 |
|---|---|---|
| UI 프레임워크 | **React 18+** | |
| 라우팅 | **react-router v7** (라이브러리 모드) | `/` = PC, `/mobile/*` = 모바일 |
| 그리드/테이블 | **TanStack Table v8** | 마이페이지 예약 내역 등 표 형태 UI |

## 제안 (자유 선택 영역)

| 영역 | 선택 | 이유 |
|---|---|---|
| 빌드 | **Vite + TypeScript** | 빠른 개발 서버, 프로토타입에 적합 |
| 스타일링 | **Tailwind CSS v4** | Figma 토큰을 theme 변수로 매핑하기 쉬움, 프로토 속도 |
| 상태 관리 | **Zustand** | 예약 플로우(날짜·인원·옵션·혜택) 상태를 가볍게 전역 관리 |
| 날짜 | **date-fns** | 체크인/아웃 캘린더 계산 |
| 캘린더 UI | **react-day-picker** | 날짜 범위 선택, 커스텀 스타일 용이 |
| 캐러셀 | **embla-carousel-react** | 메인 배너·프로모션 슬라이드 |
| 아이콘 | **lucide-react** | 얇은 라인 아이콘 — 럭셔리 톤과 어울림 |
| 폰트 | **Pretendard** (국문) + **Playfair Display** (영문 디스플레이) | Figma 톤 재현, 무료 상업 폰트 (RFP FNR 9-2 부합) |

## 데이터 전략

- `src/data/*.ts` 에 목업 데이터 상수 정의 (호텔, 객실, 패키지, 회원, 예약)
- API 계층 없이 데이터 모듈 직접 import — 프로토타입이므로 단순화
- 예약 플로우 진행 상태는 Zustand store, 완료된 예약은 store 메모리 유지(새로고침 시 초기화 허용)
- 로그인은 목업: 아무 값이나 입력 → "홍길동 / GOLD 회원" 세션으로 처리

## 폴더 구조 (초안)

```
src/
├── main.tsx / App.tsx        # 라우터 설정
├── styles/                   # 전역 스타일, 폰트, 토큰
├── data/                     # 목업 데이터 (hotels, packages, member ...)
├── stores/                   # zustand (auth, booking)
├── components/
│   ├── common/               # 버튼, 배지, 카드 등 공용
│   ├── pc/                   # PC 전용 레이아웃/컴포넌트 (Header, Footer)
│   └── mobile/               # 모바일 전용 (AppBar, BottomNav)
└── pages/
    ├── pc/                   # PC 페이지
    └── mobile/               # 모바일 페이지
```
