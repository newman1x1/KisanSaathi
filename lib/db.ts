import { openDB, type DBSchema, type IDBPDatabase } from "idb"

interface KisanSaathiDB extends DBSchema {
  userProfile: {
    key: string
    value: {
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
  }
  session: {
    key: number
    value: {
      id?: number
      userEmail: string
      otp: string
      expires: number
      isAuthenticated: boolean
    }
    autoIncrement: true
  }
  machinery: {
    key: string
    value: {
      id: string
      name: string
      category: string
      description: string
      specifications: Record<string, string>
      pricePerDay: number
      providerEmail: string
      providerName: string
      providerRating: number
      providerPhone: string
      state: string
      district: string
      images: string[]
      availability: { date: string; available: boolean }[]
      status: "available" | "rented" | "maintenance"
      reviews: {
        farmerName: string
        rating: number
        comment: string
        date: string
      }[]
      createdAt: string
    }
  }
  rentalRequests: {
    key: string
    value: {
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
      fuelIncluded: boolean
      fuelPaidBy?: "farmer" | "provider" | "shared"
      estimatedFuelCost?: number
      fuelCostPerDay?: number
      status: "pending" | "confirmed" | "rejected" | "completed" | "cancelled"
      farmerConfirmedAt?: string
      providerConfirmedAt?: string
      agreementId?: string
      disputeReported?: boolean
      disputeDetails?: string
      createdAt: string
      updatedAt: string
    }
  }
}

const DB_NAME = "KisanSaathiDB"
const DB_VERSION = 2

let dbInstance: IDBPDatabase<KisanSaathiDB> | null = null

export async function getDB() {
  if (dbInstance) {
    return dbInstance
  }

  dbInstance = await openDB<KisanSaathiDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create userProfile store with email as keyPath
      if (!db.objectStoreNames.contains("userProfile")) {
        db.createObjectStore("userProfile", { keyPath: "email" })
      }

      // Create session store with auto-incrementing id
      if (!db.objectStoreNames.contains("session")) {
        db.createObjectStore("session", {
          keyPath: "id",
          autoIncrement: true,
        })
      }

      // Create machinery store with id as keyPath
      if (!db.objectStoreNames.contains("machinery")) {
        const machineryStore = db.createObjectStore("machinery", { keyPath: "id" })
        machineryStore.createIndex("providerEmail", "providerEmail", { unique: false })
        machineryStore.createIndex("state", "state", { unique: false })
        machineryStore.createIndex("category", "category", { unique: false })
      }

      // Create rentalRequests store with id as keyPath
      if (!db.objectStoreNames.contains("rentalRequests")) {
        const requestsStore = db.createObjectStore("rentalRequests", { keyPath: "id" })
        requestsStore.createIndex("farmerEmail", "farmerEmail", { unique: false })
        requestsStore.createIndex("providerEmail", "providerEmail", { unique: false })
        requestsStore.createIndex("status", "status", { unique: false })
      }
    },
  })

  return dbInstance
}

// User Profile operations
export async function saveUserProfile(profile: KisanSaathiDB["userProfile"]["value"]) {
  const db = await getDB()
  await db.put("userProfile", profile)
}

export async function getUserProfile(email: string) {
  const db = await getDB()
  return await db.get("userProfile", email)
}

export async function getAllUserProfiles() {
  const db = await getDB()
  return await db.getAll("userProfile")
}

// Session operations
export async function saveSession(session: Omit<KisanSaathiDB["session"]["value"], "id">) {
  const db = await getDB()
  // Clear existing sessions first
  await clearSessions()
  await db.add("session", session)
}

export async function getSession() {
  const db = await getDB()
  const sessions = await db.getAll("session")
  return sessions[0] || null
}

export async function updateSession(updates: Partial<KisanSaathiDB["session"]["value"]>) {
  const db = await getDB()
  const session = await getSession()
  if (session) {
    await db.put("session", { ...session, ...updates })
  }
}

export async function clearSessions() {
  const db = await getDB()
  await db.clear("session")
}

export async function isAuthenticated() {
  const session = await getSession()
  if (!session) return false

  // Check if session is expired
  if (session.expires < Date.now()) {
    await clearSessions()
    return false
  }

  return session.isAuthenticated
}

// Additional operations
export async function userExists(email: string): Promise<boolean> {
  const db = await getDB()
  const profile = await db.get("userProfile", email)
  return !!profile
}

export async function logout() {
  await clearSessions()
}

// Machinery operations
export async function saveMachinery(machinery: KisanSaathiDB["machinery"]["value"]) {
  const db = await getDB()
  await db.put("machinery", machinery)
}

export async function getMachinery(id: string) {
  const db = await getDB()
  return await db.get("machinery", id)
}

export async function getAllMachinery() {
  const db = await getDB()
  return await db.getAll("machinery")
}

export async function getMachineryByProvider(providerEmail: string) {
  const db = await getDB()
  return await db.getAllFromIndex("machinery", "providerEmail", providerEmail)
}

export async function deleteMachinery(id: string) {
  const db = await getDB()
  await db.delete("machinery", id)
}

// Rental Request operations
export async function saveRentalRequest(request: KisanSaathiDB["rentalRequests"]["value"]) {
  const db = await getDB()
  await db.put("rentalRequests", request)
}

export async function getRentalRequest(id: string) {
  const db = await getDB()
  return await db.get("rentalRequests", id)
}

export async function getAllRentalRequests() {
  const db = await getDB()
  return await db.getAll("rentalRequests")
}

export async function getRentalRequestsByFarmer(farmerEmail: string) {
  const db = await getDB()
  return await db.getAllFromIndex("rentalRequests", "farmerEmail", farmerEmail)
}

export async function getRentalRequestsByProvider(providerEmail: string) {
  const db = await getDB()
  return await db.getAllFromIndex("rentalRequests", "providerEmail", providerEmail)
}

export async function updateRentalRequestStatus(
  id: string,
  status: KisanSaathiDB["rentalRequests"]["value"]["status"],
  additionalData?: Partial<KisanSaathiDB["rentalRequests"]["value"]>
) {
  const db = await getDB()
  const request = await getRentalRequest(id)
  if (request) {
    await db.put("rentalRequests", {
      ...request,
      status,
      ...additionalData,
      updatedAt: new Date().toISOString(),
    })
  }
}
