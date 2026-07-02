import { create } from 'zustand'
import { MOCK_MEMBER } from '@/data/member'
import type { Member } from '@/data/types'

interface AuthState {
  member: Member | null
  login: () => void
  logout: () => void
}

// 목업 인증 — 어떤 입력이든 MOCK_MEMBER(홍길동/GOLD) 세션 생성
export const useAuth = create<AuthState>((set) => ({
  member: null,
  login: () => set({ member: MOCK_MEMBER }),
  logout: () => set({ member: null }),
}))
