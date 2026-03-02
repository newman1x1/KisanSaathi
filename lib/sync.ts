/**
 * Cross-window data synchronization for demo purposes
 * Uses localStorage to share data between windows/tabs
 */

export interface SyncedRentalRequest {
  id: string
  machineryId: string
  machineryName: string
  farmerEmail: string
  farmerName: string
  farmerPhone: string
  providerEmail: string
  providerName: string
  startDate: string
  endDate: string
  totalDays: number
  totalPrice: number
  status: "pending" | "confirmed" | "rejected" | "completed" | "cancelled"
  farmerConfirmedAt?: string
  providerConfirmedAt?: string
  agreementId?: string
  disputeReported?: boolean
  disputeDetails?: string
  createdAt: string
  updatedAt: string
}

const SYNC_KEY = "kisansaathi-rental-requests-sync"

/**
 * Save rental request to localStorage for cross-window sync
 */
export function syncRentalRequest(request: SyncedRentalRequest) {
  try {
    const existing = getAllSyncedRequests()
    const index = existing.findIndex((r) => r.id === request.id)
    
    if (index >= 0) {
      existing[index] = request
    } else {
      existing.push(request)
    }
    
    localStorage.setItem(SYNC_KEY, JSON.stringify(existing))
    
    // Trigger storage event for other windows
    window.dispatchEvent(new StorageEvent("storage", {
      key: SYNC_KEY,
      newValue: JSON.stringify(existing),
    }))
  } catch (error) {
    console.error("Failed to sync rental request:", error)
  }
}

/**
 * Get all synced rental requests from localStorage
 */
export function getAllSyncedRequests(): SyncedRentalRequest[] {
  try {
    const data = localStorage.getItem(SYNC_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Failed to get synced requests:", error)
    return []
  }
}

/**
 * Get synced rental requests by farmer email
 */
export function getSyncedRequestsByFarmer(farmerEmail: string): SyncedRentalRequest[] {
  const all = getAllSyncedRequests()
  return all.filter((r) => r.farmerEmail === farmerEmail)
}

/**
 * Get synced rental requests by provider email
 */
export function getSyncedRequestsByProvider(providerEmail: string): SyncedRentalRequest[] {
  const all = getAllSyncedRequests()
  return all.filter((r) => r.providerEmail === providerEmail)
}

/**
 * Get a single synced rental request by ID
 */
export function getSyncedRequest(id: string): SyncedRentalRequest | null {
  const all = getAllSyncedRequests()
  return all.find((r) => r.id === id) || null
}

/**
 * Listen for changes to synced requests
 */
export function onSyncChange(callback: () => void) {
  const handler = (e: StorageEvent) => {
    if (e.key === SYNC_KEY) {
      callback()
    }
  }
  
  window.addEventListener("storage", handler)
  
  return () => window.removeEventListener("storage", handler)
}

/**
 * Clear all synced requests (for demo reset)
 */
export function clearSyncedRequests() {
  try {
    localStorage.removeItem(SYNC_KEY)
  } catch (error) {
    console.error("Failed to clear synced requests:", error)
  }
}
