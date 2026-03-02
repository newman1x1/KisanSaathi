import { create } from "zustand"

// User profile type matching IndexedDB schema
export interface UserProfile {
  email: string
  username: string
  country: string
  state: string
  address: string
  soilType: string
  language: string
  role?: "Farmer" | "Service Provider"
  isVerified?: boolean
  phone?: string
  rating?: number
  totalRentals?: number
}

// Extended profile type for UI state
interface ExtendedUserProfile extends UserProfile {}

interface AppState {
  userProfile: ExtendedUserProfile | null
  isAuthenticated: boolean
  setUserProfile: (profile: ExtendedUserProfile | null) => void
  setIsAuthenticated: (isAuth: boolean) => void
  reset: () => void
}

export const useAppStore = create<AppState>((set) => ({
  userProfile: null,
  isAuthenticated: false,
  setUserProfile: (profile) => set({ userProfile: profile }),
  setIsAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),
  reset: () => set({ userProfile: null, isAuthenticated: false }),
}))
