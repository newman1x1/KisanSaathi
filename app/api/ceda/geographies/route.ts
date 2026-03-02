import { NextResponse } from "next/server"
import { getGeographies } from "@/lib/ceda-api"

export async function GET() {
  try {
    const data = await getGeographies()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] CEDA API error:", error)
    return NextResponse.json({ error: "Failed to fetch geographies" }, { status: 500 })
  }
}
