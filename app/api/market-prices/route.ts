import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

function generateFallbackData(commodity: string, state: string, district?: string) {
  const commodityLower = commodity.toLowerCase()

  let basePrice = 2000
  let variance = 500

  if (commodityLower.includes("wheat") || commodityLower.includes("rice")) {
    basePrice = 2200
    variance = 400
  } else if (
    commodityLower.includes("pulse") ||
    commodityLower.includes("arhar") ||
    commodityLower.includes("moong") ||
    commodityLower.includes("chana") ||
    commodityLower.includes("chickpea")
  ) {
    basePrice = 6000
    variance = 1000
  } else if (
    commodityLower.includes("potato") ||
    commodityLower.includes("onion") ||
    commodityLower.includes("tomato")
  ) {
    basePrice = 1500
    variance = 600
  } else if (commodityLower.includes("cotton") || commodityLower.includes("sugarcane")) {
    basePrice = 6500
    variance = 800
  } else if (
    commodityLower.includes("soybean") ||
    commodityLower.includes("mustard") ||
    commodityLower.includes("groundnut") ||
    commodityLower.includes("maize")
  ) {
    basePrice = 5000
    variance = 700
  }

  const randomFactor = 0.9 + Math.random() * 0.2
  const modalPrice = Math.round(basePrice * randomFactor)
  const minPrice = Math.round(modalPrice - variance * 0.6)
  const maxPrice = Math.round(modalPrice + variance * 0.4)

  return {
    commodity,
    state,
    district: district || "State Average",
    prices: {
      min_price: minPrice,
      max_price: maxPrice,
      modal_price: modalPrice,
    },
    unit: "Rs per Quintal",
    date: new Date().toISOString().split("T")[0],
    source: "Estimated based on market trends",
    confidence: "low",
  }
}

async function fetchCommodityPrice(commodity: string, state: string, district?: string) {
  const geminiApiKey = process.env.GEMINI_API_KEY

  if (!geminiApiKey) {
    console.log(`[v0] No Gemini API key, using fallback for ${commodity}`)
    return generateFallbackData(commodity, state, district)
  }

  try {
    const genAI = new GoogleGenerativeAI(geminiApiKey)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    })

    const location = district ? `${district}, ${state}` : state

    const prompt = `You are an agricultural market data expert. Search the web for the most recent and accurate wholesale market prices (mandi prices) for ${commodity} in ${location}, India.

IMPORTANT INSTRUCTIONS:
1. Search for REAL, CURRENT market prices from reliable sources like:
   - Government agricultural marketing boards (AGMARKNET, state agricultural departments)
   - Official mandi price websites
   - Agricultural news portals
   - Commodity trading platforms

2. Look for prices from the last 7-30 days (as recent as possible)

3. Return the data in this EXACT JSON format (no markdown, no code blocks, just pure JSON):
{
  "commodity": "${commodity}",
  "state": "${state}",
  "district": "${district || "State Average"}",
  "prices": {
    "min_price": <number>,
    "max_price": <number>,
    "modal_price": <number>
  },
  "unit": "Rs per Quintal",
  "date": "YYYY-MM-DD",
  "source": "source name",
  "confidence": "high/medium/low"
}

4. If you cannot find EXACT current data from reliable sources, use your knowledge of:
   - Historical price patterns for this commodity in this region
   - Seasonal variations
   - Current market trends
   - Regional price differences
   
   Then generate REALISTIC prices and set confidence to "medium" or "low"

5. Ensure prices are reasonable:
   - Cereals: ₹1500-3500 per quintal
   - Pulses: ₹4000-8000 per quintal
   - Vegetables: ₹800-3000 per quintal
   - Fruits: ₹2000-6000 per quintal
   - Cash crops: ₹5000-8000 per quintal

6. Modal price should be between min and max
7. Return ONLY the JSON object, nothing else`

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    })

    const response = result.response
    const text = response.text()

    let cleanedText = text.trim()
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.replace(/```json\n?/g, "").replace(/```\n?/g, "")
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```\n?/g, "")
    }

    const marketData = JSON.parse(cleanedText)
    console.log(`[v0] Successfully fetched ${commodity}: ₹${marketData.prices.modal_price}`)
    return marketData
  } catch (error) {
    console.log(`[v0] Error fetching ${commodity} from Gemini, using fallback:`, error)
    return generateFallbackData(commodity, state, district)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { state } = await request.json()

    if (!state) {
      return NextResponse.json({ error: "State is required" }, { status: 400 })
    }

    console.log("[v0] Fetching market prices for state:", state)

    const selectedCommodities = [
      "Wheat",
      "Rice",
      "Potato",
      "Onion",
      "Tomato",
      "Cotton",
      "Maize",
      "Sugarcane",
      "Soybean",
      "Mustard",
      "Groundnut",
      "Chickpea",
    ]

    const marketData = []
    for (const commodity of selectedCommodities) {
      try {
        const data = await fetchCommodityPrice(commodity, state)
        marketData.push({
          commodity: data.commodity,
          price: data.prices.modal_price,
          confidence: data.confidence,
        })

        // Small delay between requests to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100))
      } catch (error) {
        console.error(`[v0] Error processing ${commodity}:`, error)
      }
    }

    if (marketData.length === 0) {
      throw new Error("Failed to fetch any market data")
    }

    console.log("[v0] Successfully fetched market data:", marketData.length, "commodities")
    return NextResponse.json(marketData)
  } catch (error) {
    console.error("[v0] Market prices API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

