// 시연 영상 녹화 스크립트 — Playwright
// 사용법: (dev 서버가 5173에서 떠 있는 상태에서) node docs/video/record.mjs
// 산출물: docs/video/clips/*.webm  (이후 mp4 변환 스크립트로 변환)
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, 'clips');
fs.mkdirSync(OUT, { recursive: true });
const BASE = 'http://localhost:5173';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 녹화된 webm을 원하는 이름으로 이동
async function finalize(context, page, name) {
  const video = page.video();
  await context.close(); // 닫아야 파일 flush
  if (video) {
    const src = await video.path();
    const dst = path.join(OUT, name + '.webm');
    fs.renameSync(src, dst);
    console.log('saved', path.relative(process.cwd(), dst));
  }
}

async function newCtx(browser, size) {
  const context = await browser.newContext({
    viewport: size,
    deviceScaleFactor: 1,
    recordVideo: { dir: OUT, size },
  });
  const page = await context.newPage();
  return { context, page };
}

async function login(page) {
  await page.getByRole('textbox', { name: '이메일' }).fill('guest@ambatel.com');
  await page.getByRole('textbox', { name: '비밀번호' }).fill('demo1234');
  await page.getByRole('button', { name: '로그인', exact: true }).click();
  await sleep(900);
}

async function slowScroll(page, total, step = 40, delay = 16) {
  for (let y = 0; y < total; y += step) {
    await page.mouse.wheel(0, step);
    await sleep(delay);
  }
}

const PC = { width: 1920, height: 1080 };
const MO = { width: 390, height: 844 };

async function clipMainHover(browser) {
  const { context, page } = await newCtx(browser, PC);
  await page.goto(BASE + '/');
  await sleep(1200);
  // 목적 태그 위 순차 hover
  for (const name of ['기념일', '가족여행', '미식', '워케이션']) {
    const el = page.getByText(name, { exact: true }).first();
    try { await el.hover({ timeout: 1500 }); } catch {}
    await sleep(700);
  }
  await sleep(400);
  await slowScroll(page, 700);
  await sleep(800);
  await finalize(context, page, 'pc-01-main-hover');
}

async function clipDetailScroll(browser) {
  const { context, page } = await newCtx(browser, PC);
  await page.goto(BASE + '/hotels/grand-pullman-seoul');
  await sleep(1200);
  await slowScroll(page, 1400);
  await sleep(800);
  await finalize(context, page, 'pc-03-detail-scroll');
}

async function clipValueCount(browser) {
  const { context, page } = await newCtx(browser, PC);
  await page.goto(BASE + '/booking');
  await sleep(1000);
  // 케이크 옵션 ON
  await page.getByRole('switch').nth(2).click();
  await sleep(900);
  await page.getByRole('button', { name: '옵션 확정하고 혜택 적용하기' }).click();
  await sleep(800); // -> /login
  await login(page); // -> /booking step1 (state kept)
  await sleep(600);
  await page.locator('button:has-text("옵션 확정하고 혜택 적용하기")').click();
  await sleep(2500); // step2 혜택 리빌 — 핵심 홀드
  await finalize(context, page, 'pc-04-value-count');
}

async function clipMypageGauge(browser) {
  const { context, page } = await newCtx(browser, PC);
  await page.goto(BASE + '/mypage'); // -> /login
  await sleep(800);
  await login(page); // -> /mypage
  await sleep(1600); // 게이지/카드 홀드
  await slowScroll(page, 900);
  await sleep(1000);
  await finalize(context, page, 'pc-05-mypage-gauge');
}

async function clipMobileFlow(browser) {
  const { context, page } = await newCtx(browser, MO);
  await page.goto(BASE + '/mobile');
  await sleep(1400);
  await page.goto(BASE + '/mobile/search'); // 초기 진입은 goto 허용(아직 상태 불필요)
  await sleep(1200);
  await page.goto(BASE + '/mobile/hotels/grand-pullman-seoul');
  await sleep(1200);
  // 이후부터는 인앱 이동으로 상태 유지
  await page.getByRole('article').filter({ hasText: 'Anniversary Dining Stay' }).getByRole('button', { name: '패키지 선택하기' }).click();
  await sleep(1200); // options
  await page.getByRole('switch').nth(2).click(); // 케이크 ON
  await sleep(900);
  await page.getByRole('button', { name: '옵션 확정하고 결제하기' }).click();
  await sleep(800); // -> login
  await login(page); // -> benefits
  await sleep(2000); // 380,000 -> 338,000 리빌 홀드
  await page.getByRole('button', { name: '혜택 적용하고 계속하기' }).click();
  await sleep(1400); // payment
  await page.getByRole('button', { name: /결제하기/ }).last().click();
  await sleep(2000); // 로딩 -> complete
  await sleep(1200);
  await finalize(context, page, 'mo-flow');
}

const browser = await chromium.launch();
try {
  await clipMainHover(browser);
  await clipDetailScroll(browser);
  await clipValueCount(browser);
  await clipMypageGauge(browser);
  await clipMobileFlow(browser);
} finally {
  await browser.close();
}
console.log('DONE');
