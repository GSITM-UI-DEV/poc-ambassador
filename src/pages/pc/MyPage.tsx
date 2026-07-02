import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import {
  Crown,
  AlertTriangle,
  Ticket,
  Gift,
  ArrowUpDown,
  Heart,
} from 'lucide-react'
import { Badge } from '@/components/common/Badge'
import { useAuth } from '@/stores/auth'
import { useBooking, calcPrice, formatPrice } from '@/stores/booking'
import { PAST_RESERVATIONS } from '@/data/reservations'
import { getPackage } from '@/data/packages'
import { getHotel, HOTELS } from '@/data/hotels'
import type { Reservation, ReservationStatus } from '@/data/types'

const STATUS_TABS = ['전체', '예약확정', '이용완료', '취소'] as const

const col = createColumnHelper<Reservation>()

export function MyPage() {
  const navigate = useNavigate()
  const member = useAuth((s) => s.member)
  const booking = useBooking()
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_TABS)[number]>('전체')
  const [sorting, setSorting] = useState<SortingState>([{ id: 'checkIn', desc: true }])

  useEffect(() => {
    if (!member) navigate('/login', { state: { from: '/mypage' } })
  }, [member, navigate])

  // 방금 완료한 예약을 목록 최상단에 합성
  const data = useMemo(() => {
    const rows = [...PAST_RESERVATIONS]
    if (booking.reservationNo) {
      const pkg = getPackage(booking.packageId ?? 'anniversary-dining-stay')!
      const hotel = getHotel(booking.hotelId ?? pkg.hotelId)!
      const price = calcPrice(pkg.id, booking.options, booking.benefits)
      rows.unshift({
        reservationNo: booking.reservationNo,
        hotelName: hotel.name,
        packageName: pkg.name,
        checkIn: booking.search.checkIn,
        checkOut: booking.search.checkOut,
        guests: `성인 ${booking.search.adults}`,
        amount: price.total,
        status: '예약확정',
        earnedPoints: price.expectedPoints,
      })
    }
    return statusFilter === '전체' ? rows : rows.filter((r) => r.status === statusFilter)
  }, [booking, statusFilter])

  const columns = useMemo(
    () => [
      col.accessor('reservationNo', {
        header: '예약번호',
        cell: (info) => (
          <span className="font-semibold tracking-wide text-brand-gold">{info.getValue()}</span>
        ),
      }),
      col.accessor('hotelName', { header: '호텔' }),
      col.accessor('packageName', {
        header: '패키지 / 객실',
        cell: (info) => <span className="text-text-secondary">{info.getValue()}</span>,
      }),
      col.accessor('checkIn', {
        header: '체크인',
        cell: (info) => info.getValue().replaceAll('-', '.'),
      }),
      col.accessor('guests', { header: '인원' }),
      col.accessor('amount', {
        header: '금액',
        cell: (info) => `${formatPrice(info.getValue())}원`,
      }),
      col.accessor('status', {
        header: '상태',
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      col.accessor('earnedPoints', {
        header: '적립',
        cell: (info) =>
          info.getValue() > 0 ? (
            <span className="font-medium text-success">+{formatPrice(info.getValue())}P</span>
          ) : (
            <span className="text-text-secondary">—</span>
          ),
      }),
    ],
    [],
  )

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (!member) return null

  const tierProgress = Math.min(
    100,
    Math.round((member.points / (member.points + member.nextTier.remaining)) * 100),
  )

  return (
    <div className="bg-cream">
      <div className="mx-auto max-w-[1280px] px-8 py-10">
        {/* 회원 헤더 + 등급 게이지 */}
        <div className="rounded-2xl bg-brand-dark p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold/20 text-brand-gold">
                <Crown size={26} />
              </span>
              <div>
                <p className="text-[22px] font-bold text-text-inverse">
                  {member.name}님
                  <Badge tone="gold" className="ml-2 align-middle">{member.tier}</Badge>
                </p>
                <p className="mt-0.5 text-[13px] text-text-inverse/60">{member.email}</p>
              </div>
            </div>
            <div className="w-[340px]">
              <div className="flex justify-between text-[12px] text-text-inverse/70">
                <span>
                  Next Tier: <b className="text-brand-gold-light">{member.nextTier.name}</b>
                </span>
                <span>{formatPrice(member.nextTier.remaining)}P 남음</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-brand-gold"
                  style={{ width: `${tierProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 위젯 4종 */}
        <div className="mt-5 grid grid-cols-4 gap-5">
          <Widget
            icon={<Crown size={18} />}
            label="보유 포인트"
            value={`${formatPrice(member.points)} P`}
          />
          <Widget
            icon={<AlertTriangle size={18} />}
            label={`소멸 예정 (${member.expiringPoints.withinDays}일 내)`}
            value={`${formatPrice(member.expiringPoints.amount)} P`}
            danger
          />
          <Widget
            icon={<Ticket size={18} />}
            label="쿠폰 · 바우처"
            value={`${member.coupons.length} 장`}
            action="사용하기"
          />
          <Widget
            icon={<Gift size={18} />}
            label="생애주기 추천"
            value="기념일 패키지"
            action="보러가기"
            onAction={() => navigate('/offers')}
          />
        </div>

        {/* 예약 내역 — TanStack Table */}
        <div className="mt-8 rounded-2xl bg-surface p-7">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-bold">예약 내역</h2>
            <div className="flex gap-1.5">
              {STATUS_TABS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`cursor-pointer rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
                    statusFilter === s
                      ? 'bg-brand-dark text-text-inverse'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <table className="mt-5 w-full border-collapse text-[13px]">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-y border-line bg-cream/60">
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      onClick={h.column.getToggleSortingHandler()}
                      className="cursor-pointer px-4 py-3 text-left font-semibold text-text-secondary select-none"
                    >
                      <span className="inline-flex items-center gap-1">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        <ArrowUpDown size={12} className="opacity-40" />
                        {{ asc: '↑', desc: '↓' }[h.column.getIsSorted() as string] ?? ''}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-line transition-colors hover:bg-cream/40">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-14 text-center text-text-secondary">
                    해당 상태의 예약이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 최근 본 숙소 */}
        <div className="mt-8">
          <h2 className="text-[18px] font-bold">최근 본 숙소</h2>
          <div className="mt-4 grid grid-cols-4 gap-5">
            {HOTELS.map((h) => (
              <Link
                key={h.id}
                to={`/hotels/${h.id}`}
                className="group overflow-hidden rounded-2xl bg-surface"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={h.images[0]}
                    alt={h.name}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Heart size={16} className="absolute top-3 right-3 text-white" />
                </div>
                <div className="p-4">
                  <p className="truncate text-[14px] font-bold">{h.name}</p>
                  <p className="mt-1 text-[13px] text-text-secondary">
                    회원가 <b className="text-text-primary">{formatPrice(h.lowestPrice)}원~</b>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Widget({
  icon,
  label,
  value,
  danger,
  action,
  onAction,
}: {
  icon: React.ReactNode
  label: string
  value: string
  danger?: boolean
  action?: string
  onAction?: () => void
}) {
  return (
    <div className="rounded-2xl bg-surface p-5">
      <div className={`flex items-center gap-2 text-[12px] ${danger ? 'text-danger' : 'text-text-secondary'}`}>
        {icon}
        {label}
      </div>
      <div className="mt-2.5 flex items-end justify-between">
        <p className={`text-[20px] font-bold ${danger ? 'text-danger' : ''}`}>{value}</p>
        {action && (
          <button
            onClick={onAction}
            className="cursor-pointer text-[12px] font-semibold text-brand-gold hover:underline"
          >
            {action} →
          </button>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: ReservationStatus }) {
  if (status === '예약확정') return <Badge tone="gold">예약확정</Badge>
  if (status === '이용완료') return <Badge tone="outline">이용완료</Badge>
  return <Badge tone="danger">취소</Badge>
}
