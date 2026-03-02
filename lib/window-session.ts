/**
 * Session management using sessionStorage for window-specific sessions
 * This allows multiple demo accounts to be active in different windows simultaneously
 */

export interface WindowSession {
  userEmail: string
  isAuthenticated: boolean
  expires: number
  createdAt: number
}

const SESSION_KEY = "kisansaathi-window-session"

/**
 * Save session to sessionStorage (window-specific)
 */
export function saveWindowSession(session: WindowSession): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch (error) {
    console.error("Failed to save window session:", error)
  }
}

/**
 * Get session from sessionStorage
 */
export function getWindowSession(): WindowSession | null {
  try {
    const data = sessionStorage.getItem(SESSION_KEY)
    if (!data) return null
    
    const session: WindowSession = JSON.parse(data)
    
    // Check if session is expired
    if (session.expires < Date.now()) {
      clearWindowSession()
      return null
    }
    
    return session
  } catch (error) {
    console.error("Failed to get window session:", error)
    return null
  }
}

/**
 * Check if window has an authenticated session
 */
export function isWindowAuthenticated(): boolean {
  const session = getWindowSession()
  return session?.isAuthenticated ?? false
}

/**
 * Clear window session
 */
export function clearWindowSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch (error) {
    console.error("Failed to clear window session:", error)
  }
}

/**
 * Get current user email from window session
 */
export function getWindowUserEmail(): string | null {
  const session = getWindowSession()
  return session?.userEmail ?? null
}
