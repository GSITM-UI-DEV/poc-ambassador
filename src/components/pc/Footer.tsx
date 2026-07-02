import { Link } from 'react-router'

const COLS = [
  {
    title: '호텔',
    links: ['그랜드 앰배서더 서울 풀만', '노보텔 앰배서더 강남', '이비스 스타일 앰배서더 서울', '소피텔 앰배서더 서울'],
  },
  {
    title: '멤버십',
    links: ['멤버십 안내', '등급별 혜택', '포인트 이용 안내', '제휴 혜택'],
  },
  {
    title: '고객지원',
    links: ['자주 묻는 질문', '예약 확인 · 취소', '이용 약관', '개인정보 처리방침'],
  },
]

export function Footer() {
  return (
    <footer className="bg-brand-dark text-text-inverse">
      <div className="mx-auto grid max-w-[1280px] grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 px-8 py-16">
        <div>
          <p className="text-display text-[20px] tracking-[0.2em]">AMBATEL</p>
          <p className="mt-1 text-[10px] tracking-[0.3em] text-brand-gold-light">
            AMBASSADOR HOTELS &amp; RESORTS
          </p>
          <p className="mt-5 max-w-[300px] text-[13px] leading-relaxed text-text-inverse/60">
            1955년부터 이어온 대한민국 호텔의 자부심.
            앰배서더는 공식 채널에서 가장 좋은 조건을 약속합니다.
          </p>
        </div>
        {COLS.map((col) => (
          <div key={col.title}>
            <p className="text-eyebrow mb-4 text-brand-gold-light">{col.title}</p>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l}>
                  <Link to="/guide" className="text-[13px] text-text-inverse/70 hover:text-brand-gold-light">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-8 py-5 text-[12px] text-text-inverse/40">
          <span>© 2026 Ambassador Hotel Group. All rights reserved. — RFP 제안용 프로토타입</span>
          <Link to="/guide" className="hover:text-brand-gold-light">페이지 목록</Link>
        </div>
      </div>
    </footer>
  )
}
