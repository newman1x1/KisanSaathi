import { NextResponse } from "next/server"
import { getMarkets } from "@/lib/ceda-api"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = await getMarkets(body)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] CEDA API error:", error)
    return NextResponse.json({ error: "Failed to fetch markets" }, { status: 500 })
  }
}
