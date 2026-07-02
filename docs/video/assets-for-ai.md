# 영상 AI 전달 패키지 명세

**THE AMBASSADOR SEOUL × GSITM — Digital Renewal Proposal Film / 40초**

영상 전문 AI(Veo / Runway / Sora 등)에게 아래를 한 폴더로 전달한다.
이 문서 + `storyboard.md` + `script.md` 를 프롬프트 컨텍스트로 함께 넣으면 됨.

---

## 1. 소재 파일

### 스틸 (`stills/`) — PC 1920×1080 / 모바일 390×844, PNG, device scale
| 파일 | 씬 | 내용 |
|---|---|---|
| `pc-01-main.png` | S2 | 메인 히어로 + 목적 태그 + 공식 혜택 카드 |
| `pc-02-search.png` | S3 | 검색 결과 |
| `pc-03-hotel-detail.png` | S3 | 호텔 상세 |
| `pc-04-booking.png` | S4 | 예약 STEP1 옵션 선택 |
| `pc-05-booking-benefits.png` | **S4★** | STEP2 혜택 — Gold 카드 + 338,000원 분해 |
| `pc-06-booking-payment.png` | S4 | STEP3 결제 |
| `pc-07-complete.png` | S4/S5 | 예약 완료 + Next Tier 게이지 |
| `pc-08-mypage.png` | **S5** | 멤버십 대시보드 |
| `pc-09-login.png` | (참고) | 로그인 + 멤버 혜택 |
| `pc-10-offers.png` | (참고) | 스페셜 오퍼 |
| `mo-01-home.png` ~ `mo-08-login.png` | S6 | 모바일 7단계 플로우 + 로그인 |

### 클립 (`clips/`) — 실제 조작 녹화, 브라우저 크롬 없음
| 파일 | 씬 | 내용 | 비고 |
|---|---|---|---|
| `pc-01-main-hover.*` | S2 | 메인 목적 태그 hover + 스크롤 | |
| `pc-03-detail-scroll.*` | S3 | 호텔 상세 스크롤 | |
| `pc-04-value-count.*` | **S4★** | 옵션→로그인→혜택 리빌(338,000원 등장) | 핵심 클립 |
| `pc-05-mypage-gauge.*` | **S5** | 마이페이지 게이지/대시보드 | |
| `mo-flow.*` | S6 | 모바일 홈→…→완료 풀 플로우 | 몽타주 소스 |

> 포맷: 1차 산출 `.webm`(VP8). ffmpeg 변환 시 `.mp4`(H.264) 동봉. 둘 다 있으면 mp4 우선 사용.
> 재생성: dev 서버(`npm run dev`) 켜고 `node docs/video/record.mjs`.

---

## 2. 브랜드 에셋

- **로고** — ✅ 확보. `docs/reference/logo/`
  - `amber logo.png` (앰배서더, 차콜 라인아트·투명, 1740×960) — **밝은/크림 배경용**
  - `amber-logo-light.png` (앰배서더 밝은 버전·투명) — **어두운 배경용** (인트로/아웃트로)
  - `GSITM 로고.svg` (블루/그레이 벡터) — 아웃트로 락업
- **컬러 토큰** (`src/index.css` @theme 기준)
  | 이름 | HEX | 용도 |
  |---|---|---|
  | brand-gold | `#b7935b` | 강조·CTA·숫자 하이라이트 |
  | brand-gold-light | `#d4bc8b` | 서브 강조 |
  | brand-dark | `#1c1b19` | 배경(인트로/아웃트로) |
  | cream | `#f7f4ee` | 텍스트/밝은 배경 |
  | gold-serif | `#a8834e` | 세리프 타이틀 |
  | success | `#2e7d4f` | 절약/적립 강조 |
- **폰트** — 본문 Pretendard(국문), 디스플레이 Playfair Display(영문 세리프).

---

## 3. 무드 · 음악 레퍼런스 (사용자 지정)
톤 = Google 제품 런칭 필름 (깔끔한 UI 쇼케이스). 컬러만 앰배서더 럭셔리 톤으로 치환.
- https://www.youtube.com/watch?v=tz9m9JtAGNw (Interactive visuals · Gemini 3)
- https://www.youtube.com/watch?v=8sABhCMxU3c (Personal Intelligence · AI Mode)
- https://www.youtube.com/watch?v=rPXBDSf-Hwg (Gemini 3 Flash · speed)
- 음악 무드: 앰비언트 + 절제된 업비트, 럭셔리·모던·신뢰. 0:20 '338,000원' 확정에 임팩트 히트.

---

## 4. 스펙 시트 (기본값 — §PLAN 결정사항 확정 시 갱신)
| 항목 | 값 |
|---|---|
| 길이 | 40초 |
| 화면비 | **16:9 (1920×1080) 확정** — 9:16 세로 버전 없음 |
| 용도 | 제안 PT 상영 · 유튜브 |
| fps | 30 (모션 우선 시 60) |
| 포맷 | MP4 (H.264) / 마스터 ProRes 선택 |
| 언어 | **한국어 자막 (VO 미사용, 자막+음악만)** |
| 자막 | Pretendard SemiBold, 크림/골드, 1줄 12자 내외 |

---

## 5. 영상 AI 프롬프트 스타터 (붙여넣기용)
> "40초 호텔 브랜드 제안 필름. 톤은 Google 제품 런칭 필름처럼 깔끔한 UI 쇼케이스 —
> 플로팅 디바이스 프레임, 부드러운 줌/팬/틸트, 키네틱 타이포 자막, 스냅한 컷 전환.
> 단, 컬러 팔레트는 럭셔리 호텔 톤(딥다크 #1c1b19 배경, 골드 #b7935b 강조, 크림 #f7f4ee 텍스트).
> 첨부한 stills/clips를 화면 소스로 쓰고, storyboard.md의 씬·타이밍·자막을 그대로 따를 것.
> 하이라이트는 S4: 정가에서 회원할인·쿠폰이 순차 차감되며 '338,000원 · 42,000원 절약'이 등장하는 순간."

---

## 6. Google Flow (Veo) 사용 가이드 ⚠️

Flow는 **생성 AI(Veo 기반) 제작 툴**. 내 클립·이미지를 업로드해 타임라인에 이어붙이는 건 되지만,
**본질은 생성**이라 아래 경계를 반드시 지킬 것.

### 핵심 원칙: UI는 "배치", 껍데기는 "생성"
| 구분 | 방법 | 대상 |
|---|---|---|
| ✅ 그대로 배치 (재생성 X) | Flow 타임라인에 **업로드해서 그대로** 얹기 | `clips/` 5개 + `stills/` 18장 (실제 화면·가격·텍스트) |
| ✅ Flow로 생성 | `storyboard.md` 프롬프트로 **새로 생성** | 인트로/아웃트로 브랜드 씬, 골드 파티클 트랜지션, 앰비언트 무드 b-roll, 디바이스 시네마틱 컷 |
| ❌ 하지 말 것 | UI 스틸을 image-to-video 씨앗으로 넣고 생성 | → 한글/숫자 뭉개짐. "338,000원·42,000원 절약" 깨지면 제안 사고 |
| ➕ 자막 | Veo 생성 말고 **오버레이 텍스트 레이어** | `script.md`의 한글 키네틱 자막 |

### 실무 체크
- **생성 클립은 8~10초 한도** → 여러 개 체인. 단, *업로드 footage는 이 한도와 무관*하게 그대로 배치 가능.
- `mo-flow.mp4`(14.6초)는 업로드 footage라 그대로 OK. 필요 시 컷 분할.
- 한글 자막이 Flow 오버레이에서 어색하면 **마지막에 CapCut / Google Vids로 자막 패스만** 얹기 (안전).
- 화면비 16:9 통일. first/last-frame 트랜지션 기능은 `stills/` 사이 이음새에 활용.
- 첨부 순서: 이 문서 + `storyboard.md` + `script.md` 를 컨텍스트로, `clips/`·`stills/` 를 소스로.

---

## 7. 결정 확정 (2026-07-02)
1. ✅ **로고** 확보 — `docs/reference/logo/` (§2 참조)
2. ✅ **화면비 16:9** (PT·유튜브), 9:16 세로판 없음
3. ✅ **자막 + 음악만** (VO 미사용)
4. ✅ **영상 AI = Google Flow (Veo)** → `flow-prompts.md`
5. ⬜ (선택) 실서비스 아님 **고지 자막** 넣을지 — 미정
