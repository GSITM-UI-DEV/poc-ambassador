import { Link } from 'react-router'

// 시연·검수용 페이지 URL 인덱스 — 의도적으로 최소한의 스타일만 사용
const PC_PAGES = [
  ['메인', '/'],
  ['로그인', '/login'],
  ['검색 결과', '/search'],
  ['호텔 상세', '/hotels/grand-pullman-seoul'],
  ['예약하기 (3-step)', '/booking'],
  ['예약 완료', '/booking/complete'],
  ['마이페이지', '/mypage'],
  ['스페셜 오퍼', '/offers'],
  ['페이지 URL 가이드', '/guide'],
]

const MOBILE_PAGES = [
  ['홈', '/mobile'],
  ['검색 결과', '/mobile/search'],
  ['호텔 상세', '/mobile/hotels/grand-pullman-seoul'],
  ['옵션 추가', '/mobile/booking/options'],
  ['회원 혜택 적용', '/mobile/booking/benefits'],
  ['결제', '/mobile/booking/payment'],
  ['예약 완료', '/mobile/booking/complete'],
  ['로그인', '/mobile/login'],
]

function PageTable({ title, pages }: { title: string; pages: string[][] }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-[18px] font-bold">{title}</h2>
      <table className="w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-y border-gray-300 bg-gray-50">
            <th className="px-4 py-2 text-left font-semibold">페이지명</th>
            <th className="px-4 py-2 text-left font-semibold">URL</th>
          </tr>
        </thead>
        <tbody>
          {pages.map(([name, url]) => (
            <tr key={url + name} className="border-b border-gray-200">
              <td className="px-4 py-2">{name}</td>
              <td className="px-4 py-2">
                <Link to={url} className="text-blue-600 underline">
                  {url}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export function GuidePage() {
  return (
    <div className="mx-auto max-w-[720px] px-6 py-16">
      <h1 className="mb-10 text-center text-[26px] font-bold">
        AMBATEL 프로토타입 페이지 목록
      </h1>
      <PageTable title="PC" pages={PC_PAGES} />
      <PageTable title="모바일" pages={MOBILE_PAGES} />
    </div>
  )
}
