import { NextResponse } from "next/server"
import { getCommodities } from "@/lib/ceda-api"

export async function GET() {
  try {
    const data = await getCommodities()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] CEDA API error:", error)
    return NextResponse.json({ error: "Failed to fetch commodities" }, { status: 500 })
  }
}
