import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  user: any | null
  wallet: any | null
  setUser: (user: any) => void
  setWallet: (wallet: any) => void
  logout: () => void
}

export const useStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      wallet: null,
      setUser: (user) => set({ user }),
      setWallet: (wallet) => set({ wallet }),
      logout: () => set({ user: null, wallet: null }),
    }),
    {
      name: 'victoria-storage',
    }
  )
)
