import { format, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'

// '2026-07-24' → '7.24(금)'
export const fmtDay = (iso: string) =>
  format(parseISO(iso), 'M.d(EEEEE)', { locale: ko })

// '2026-07-24' → '2026.07.24'
export const fmtFull = (iso: string) => format(parseISO(iso), 'yyyy.MM.dd')
