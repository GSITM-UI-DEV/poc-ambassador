import { useNavigate } from 'react-router'
import { ChevronLeft, Search, Menu } from 'lucide-react'

export function AppBar({
  title,
  back = true,
  dark = false,
}: {
  title?: string
  back?: boolean
  dark?: boolean
}) {
  const navigate = useNavigate()
  const fg = dark ? 'text-text-inverse' : 'text-text-primary'

  return (
    <div
      className={`sticky top-0 z-30 flex h-12 items-center px-2 ${
        dark ? 'bg-brand-dark' : 'bg-surface border-b border-line'
      }`}
    >
      <div className="flex w-12 justify-start">
        {back && (
          <button
            onClick={() => navigate(-1)}
            className={`p-2 ${fg} cursor-pointer`}
            aria-label="뒤로가기"
          >
            <ChevronLeft size={22} />
          </button>
        )}
      </div>
      <h1 className={`flex-1 text-center text-[16px] font-semibold ${fg}`}>{title}</h1>
      <div className={`flex w-12 justify-end gap-1 pr-1 ${fg}`}>
        <Search size={19} className="opacity-70" />
        <Menu size={19} className="opacity-70" />
      </div>
    </div>
  )
}
