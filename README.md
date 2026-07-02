# Ambassador Proposal Film

THE AMBASSADOR SEOUL × GSITM — Digital Renewal Proposal Film

엠배서더 호텔 홈페이지 재구축 RFP 제안용 프로토타입. 백엔드 없이 목업 데이터로 동작하는 시연용 프론트엔드입니다.

## 실행

```bash
npm install
npm run dev   # http://localhost:5173
```

## 페이지

- 전체 페이지 목록·바로가기: **http://localhost:5173/guide**
- PC: `/` (메인) · 모바일: `/mobile` — URL prefix로 디바이스 분리 (반응형 아님, 모바일은 390px 뷰포트 기준)

## 시연 시나리오

```
[PC]     메인 → 검색 결과 → 호텔 상세 → 예약 3-step(옵션→혜택→결제) → 완료 → 마이페이지
[Mobile] 홈 → 검색 → 상세 → 옵션 추가 → 회원 혜택 적용 → 결제 → 예약 완료
```

- 로그인: 아무 값이나 입력해도 **홍길동 / GOLD** 세션이 생성됩니다 (소셜 버튼 포함).
- 혜택 적용 단계는 로그인이 필요하며, 미로그인 시 로그인 후 자동 복귀합니다.
- 가격 검증치(Figma 결제 화면 기준): 345,000 + 케이크 35,000 − 회원 32,000 − 쿠폰 10,000 = **338,000원**, 적립 3,200P

## 스택

React 19 · Vite · TypeScript · react-router · TanStack Table · Tailwind CSS v4 · Zustand · date-fns · embla-carousel · lucide-react

## 문서

- 기획/설계: `docs/plan/00~06`
- 디자인 토큰: `docs/plan/03-design.md` → `src/index.css`의 `@theme`에 반영 (Figma 변경 시 토큰만 갱신)
- 참고 자료: `docs/reference` (RFP, UIUX 제안 방향, Figma URL)

## Deployment

Pushes to `main` are automatically synced to S3 via GitHub Actions (`.github/workflows/deploy.yml`).

- Bucket: `ambassador-proposal-film.gsitm-frontend.site`
- Region: `ap-northeast-2`
- Custom domain: `ambassador-proposal-film.gsitm-frontend.site` (Route53 alias → S3 website endpoint)

> The bucket name must match the custom domain exactly — S3 website hosting routes by
> the `Host` header, so a Route53 alias to the S3 website endpoint only resolves if a
> bucket with that exact name exists.

### One-time setup

1. **S3 bucket** — enable static website hosting on `ambassador-proposal-film.gsitm-frontend.site`, set `index.html` as the index document, and attach a bucket policy allowing public `s3:GetObject`.
2. **IAM user** — create an IAM user with a policy allowing `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket` on the bucket, and generate an access key.
3. **GitHub repo secrets** (Settings → Secrets and variables → Actions):
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

After that, any push to `main` redeploys the site automatically.
