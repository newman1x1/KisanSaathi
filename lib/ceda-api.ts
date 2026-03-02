const CEDA_API_BASE = "https://api.ceda.ashoka.edu.in/v1"
const CEDA_API_KEY = process.env.CEDA_API_KEY

console.log("[v0] CEDA_API_KEY exists:", !!CEDA_API_KEY)
console.log("[v0] CEDA_API_KEY length:", CEDA_API_KEY?.length || 0)

export interface Commodity {
  id: number
  name: string
}

export interface Geography {
  state_id: number
  state_name: string
  districts: {
    district_id: number
    district_name: string
  }[]
}

export interface Market {
  census_state_id: number
  census_district_id: number
  market_id: number
  market_name: string
}

export interface PriceRecord {
  date: string
  commodity_id: number
  census_state_id: number
  census_district_id: number
  market_id: number
  min_price: number
  max_price: number
  modal_price: number
}

export interface QuantityRecord {
  date: string
  commodity_id: number
  census_state_id: number
  census_district_id: number
  market_id: number
  quantity: number
}

async function cedaFetch(endpoint: string, options?: RequestInit) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${CEDA_API_KEY || ""}`,
    ...options?.headers,
  }

  console.log("[v0] Fetching CEDA endpoint:", endpoint)
  console.log("[v0] Headers being sent:", {
    ...headers,
    Authorization: headers["Authorization"] ? `Bearer ${CEDA_API_KEY?.substring(0, 10)}...` : "MISSING",
  })

  const response = await fetch(`${CEDA_API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("[v0] CEDA API error:", errorText)
    throw new Error(`CEDA API error: ${response.status}`)
  }

  return response.json()
}

export async function getCommodities(): Promise<{ commodities: Commodity[] }> {
  return cedaFetch("/agmarknet/commodities")
}

export async function getGeographies(): Promise<{ geographies: Geography[] }> {
  return cedaFetch("/agmarknet/geographies")
}

export async function getMarkets(params: {
  commodity_id: number
  state_id: number
  district_id: number
  indicator: "price" | "quantity"
}): Promise<{ data: Market[] }> {
  return cedaFetch("/agmarknet/markets", {
    method: "POST",
    body: JSON.stringify(params),
  })
}

export async function getPrices(params: {
  commodity_id: number
  state_id: number
  district_id?: number[]
  market_id?: number[]
  from_date: string
  to_date: string
}): Promise<{ data: PriceRecord[] }> {
  return cedaFetch("/agmarknet/prices", {
    method: "POST",
    body: JSON.stringify(params),
  })
}

export async function getQuantities(params: {
  commodity_id: number
  state_id: number
  district_id?: number[]
  market_id?: number[]
  from_date: string
  to_date: string
}): Promise<{ data: QuantityRecord[] }> {
  return cedaFetch("/agmarknet/quantities", {
    method: "POST",
    body: JSON.stringify(params),
  })
}
