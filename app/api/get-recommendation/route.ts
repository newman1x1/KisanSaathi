import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    const { userProfile } = await request.json()

    if (!userProfile) {
      return NextResponse.json({ error: "User profile is required" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    let weatherData = null
    try {
      const lat = "30.7333"
      const lon = "76.7794"
      const weatherApiKey = process.env.OPENWEATHERMAP_API_KEY

      if (weatherApiKey) {
        const currentWeatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`,
        )
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`,
        )

        if (currentWeatherResponse.ok && forecastResponse.ok) {
          const currentData = await currentWeatherResponse.json()
          const forecastData = await forecastResponse.json()

          weatherData = {
            current: {
              temp: Math.round(currentData.main.temp),
              condition: currentData.weather[0].main,
              description: currentData.weather[0].description,
              humidity: currentData.main.humidity,
              windSpeed: Math.round(currentData.wind.speed * 3.6),
              feelsLike: Math.round(currentData.main.feels_like),
            },
            forecast: forecastData.list
              .filter((_: any, index: number) => index % 8 === 0)
              .slice(0, 7)
              .map((item: any) => ({
                date: item.dt_txt.split(" ")[0],
                maxTemp: Math.round(item.main.temp_max),
                minTemp: Math.round(item.main.temp_min),
                condition: item.weather[0].main,
              })),
          }
          console.log("[v0] Weather data fetched successfully for recommendation")
        }
      }
    } catch (error) {
      console.log("[v0] Failed to fetch weather for recommendation:", error)
    }

    let marketData = null
    try {
      const marketModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
      const marketPrompt = `Provide current market prices for major agricultural commodities in ${userProfile.state}, India. 
      
Return ONLY a JSON array with this exact format (no markdown, no explanation):
[
  {"commodity": "Wheat", "price": 2500},
  {"commodity": "Rice", "price": 3200},
  {"commodity": "Cotton", "price": 7500}
]

Include 5-8 major commodities relevant to ${userProfile.state}. Prices should be in INR per quintal and reflect realistic current market rates.`

      const marketResult = await marketModel.generateContent(marketPrompt)
      const marketText = marketResult.response.text().trim()

      const jsonMatch = marketText.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        marketData = JSON.parse(jsonMatch[0])
        console.log("[v0] Market data generated successfully for recommendation:", marketData.length, "commodities")
      }
    } catch (error) {
      console.log("[v0] Failed to fetch market prices for recommendation:", error)
    }

    // Fallback to internal market-prices API if Gemini (primary) returned nothing
    if (!marketData || (Array.isArray(marketData) && marketData.length === 0)) {
      try {
        const origin = new URL(request.url).origin
        const res = await fetch(`${origin}/api/market-prices`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ state: userProfile.state }),
          cache: "no-store",
        })
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            marketData = data
            console.log("[v0] Using fallback market data from internal API:", data.length, "commodities")
          }
        } else {
          console.warn("[v0] Fallback market-prices API status:", res.status)
        }
      } catch (e) {
        console.warn("[v0] Fallback to internal market-prices failed:", e)
      }
    }

    // Language mapping for proper translation
    const languageInstructions = {
      Hindi: "Hindi",
      Punjabi: "Punjabi",
      Marathi: "Marathi",
      Telugu: "Telugu",
      English: "English"
    }
    
    const languageScripts = {
      Hindi: "हिंदी (Devanagari script)",
      Punjabi: "ਪੰਜਾਬੀ (Gurmukhi script)",
      Marathi: "मराठी (Devanagari script)",
      Telugu: "తెలుగు (Telugu script)",
      English: "English"
    }
    
    const selectedLanguage = languageInstructions[userProfile.language as keyof typeof languageInstructions] || "Hindi"
    const selectedScript = languageScripts[userProfile.language as keyof typeof languageScripts] || "हिंदी (Devanagari script)"

    const prompt = `You are an expert agricultural advisor AI assistant for Indian farmers. 

**CRITICAL LANGUAGE REQUIREMENT - READ CAREFULLY:**
The farmer's preferred language is: ${selectedLanguage}
You MUST write in the ${selectedLanguage} language using ${selectedScript}.

YOU MUST provide every section in BOTH languages with this EXACT format WITHOUT the language name prefix:

**Section Heading**

English: [Write complete content in English here - DO NOT prefix with "English:" inside the content]

${selectedLanguage}: [Write COMPLETE translation in ${selectedLanguage} language using the proper script - ${selectedScript}. This MUST be in the native language, NOT English! DO NOT prefix with "${selectedLanguage}:" inside the content]

CORRECT FORMAT EXAMPLE:
English: Check soil moisture before irrigation
${selectedLanguage}: [Translation in native script without language name]

WRONG FORMAT (DO NOT DO THIS):
English: English: Check soil moisture...
${selectedLanguage}: ${selectedLanguage}: [Translation]...

**CRITICAL RULES:**
1. DO NOT repeat the language label (English:, ${selectedLanguage}:, Marathi:, etc.) inside the content after you've already specified it
2. Write directly in the target language/script without prefixing each line
3. The language label appears ONCE at the start of each paragraph, not before every sentence

**VERIFICATION**: Ensure your ${selectedLanguage} content is written ONLY in ${selectedScript}, not in English with a language label prefix

**FARMER PROFILE:**
- Name: ${userProfile.username}
- Location: ${userProfile.state}, ${userProfile.country}
- Soil Type: ${userProfile.soilType}
- Preferred Language: ${selectedLanguage}
- Email: ${userProfile.email}

**CURRENT WEATHER CONDITIONS:**
${
  weatherData
    ? `- Temperature: ${weatherData.current.temp}°C
- Condition: ${weatherData.current.condition} (${weatherData.current.description})
- Humidity: ${weatherData.current.humidity}%
- Wind Speed: ${weatherData.current.windSpeed} km/h
- Feels Like: ${weatherData.current.feelsLike}°C

**7-DAY FORECAST:**
${weatherData.forecast
  .map(
    (day: any) =>
      `- ${new Date(day.date).toLocaleDateString("en-IN")}: ${day.condition}, High: ${day.maxTemp}°C, Low: ${day.minTemp}°C`,
  )
  .join("\n")}`
    : "- Weather data unavailable"
}

**CURRENT MARKET PRICES (${userProfile.state}):**
${
  marketData && marketData.length > 0
    ? marketData.map((item: any) => `- ${item.commodity}: ₹${Number(item.price).toLocaleString()}/quintal`).join("\n")
    : "- Market data unavailable"
}

Based on this comprehensive information, provide a detailed recommendation covering:

1. **IMMEDIATE ACTIONS** (तुरंत करने योग्य कार्य / Next 24-48 hours)
   English: [What ${userProfile.username} should do right now based on current conditions]
   ${selectedLanguage}: [Complete translation of the above in ${selectedLanguage}]

2. **CROP RECOMMENDATIONS** (फसल सिफारिशें / Suitable Crops)
   English: [Best crops to plant/harvest considering ${userProfile.soilType} soil, weather, and market prices. Include timing and profitability.]
   ${selectedLanguage}: [Complete translation of the above in ${selectedLanguage}]

3. **WEATHER-BASED ADVICE** (मौसम आधारित सलाह / Weather Guidance)
   English: [How to prepare for upcoming weather conditions (next 7 days), irrigation recommendations, pest/disease risks]
   ${selectedLanguage}: [Complete translation of the above in ${selectedLanguage}]

4. **MARKET INSIGHTS** (बाजार संबंधी जानकारी / Market Analysis)
   Provide at least 3-4 detailed market insights based on the current prices shown above:
   
   For EACH insight, provide BOTH language versions:
   
   **Insight 1:**
   English: [Detailed insight about a specific crop's market price and what the farmer should do]
   ${selectedLanguage}: [Complete translation of the insight in ${selectedLanguage}]
   
   **Insight 2:**
   English: [Strategic advice about crops fetching good prices]
   ${selectedLanguage}: [Complete translation in ${selectedLanguage}]
   
   **Insight 3:**
   English: [Recommendations on selling vs storing based on market trends]
   ${selectedLanguage}: [Complete translation in ${selectedLanguage}]
   
   Continue for all insights covering: current high-value crops, profitability strategies, and timing recommendations.

5. **SOIL-SPECIFIC GUIDANCE** (मिट्टी विशिष्ट मार्गदर्शन / Soil Care)
   English: [Fertilizer recommendations for ${userProfile.soilType} soil, soil preparation tips, crop rotation suggestions]
   ${selectedLanguage}: [Complete translation of the above in ${selectedLanguage}]

**CRITICAL: Every single section must have content in BOTH English and ${selectedLanguage}. Do not skip the ${selectedLanguage} translation for any section.**

Please provide specific, actionable advice that ${userProfile.username} can implement immediately. Be concise but comprehensive, and ensure the recommendations are practical for a farmer in ${userProfile.state}.

Format your response with clear headings using markdown. Make it personal and address the farmer by name where appropriate.`

    let text = ""
    let retryCount = 0
    const maxRetries = 2

    while (retryCount <= maxRetries) {
      try {
        const result = await model.generateContent(prompt)
        text = result.response.text()
        console.log("[v0] Recommendation generated successfully, length:", text.length)
        break
      } catch (error: any) {
        retryCount++
        console.error(`[v0] Recommendation generation attempt ${retryCount} failed:`, error.message)

        if (retryCount > maxRetries) {
          text = `# Personalized Farming Recommendation for ${userProfile.username}

## Current Farm Profile
- **Location**: ${userProfile.state}, ${userProfile.country}
- **Soil Type**: ${userProfile.soilType}
- **Current Weather**: ${weatherData ? `${weatherData.current.temp}°C, ${weatherData.current.condition}` : "Data unavailable"}

## Immediate Actions (Next 24-48 hours)

Based on your ${userProfile.soilType} soil and current conditions in ${userProfile.state}, here are your priority actions:

- **Monitor Weather**: ${weatherData ? `Current temperature is ${weatherData.current.temp}°C with ${weatherData.current.humidity}% humidity` : "Check local weather forecasts regularly"}
- **Soil Preparation**: ${userProfile.soilType} soil requires specific care - ensure proper drainage and organic matter content
- **Irrigation Planning**: Adjust watering schedule based on current humidity levels

## Crop Recommendations

For ${userProfile.soilType} soil in ${userProfile.state}:

### Suitable Crops:
${
  userProfile.soilType === "Alluvial"
    ? "- Rice, Wheat, Sugarcane, Cotton\n- Vegetables: Potato, Onion, Tomato"
    : userProfile.soilType === "Black"
      ? "- Cotton, Soybean, Wheat, Jowar\n- Pulses: Chickpea, Pigeon pea"
      : userProfile.soilType === "Red"
        ? "- Groundnut, Millets, Pulses\n- Vegetables: Tomato, Potato"
        : userProfile.soilType === "Laterite"
          ? "- Rice, Ragi, Cashew, Coconut\n- Vegetables: Tapioca, Sweet potato"
          : "- Millets, Pulses, Drought-resistant crops"
}

## Weather-Based Advice

${
  weatherData
    ? `### 7-Day Outlook:
${weatherData.forecast
  .slice(0, 5)
  .map(
    (day: any) =>
      `- ${new Date(day.date).toLocaleDateString("en-IN")}: ${day.condition}, ${day.minTemp}°C - ${day.maxTemp}°C`,
  )
  .join("\n")}

**Recommendations:**
- ${weatherData.current.humidity > 70 ? "High humidity detected - monitor for fungal diseases" : "Moderate humidity - maintain regular irrigation"}
- ${weatherData.current.windSpeed > 20 ? "Strong winds expected - secure young plants and structures" : "Normal wind conditions - proceed with regular activities"}`
    : "Weather data is currently unavailable. Please check local forecasts and plan accordingly."
}

## Market Insights

${
  marketData && marketData.length > 0
    ? `### Current Market Prices in ${userProfile.state}:

${marketData
  .slice(0, 8)
  .map((item: any) => `- **${item.commodity}**: ₹${Number(item.price).toLocaleString()}/quintal`)
  .join("\n")}

**Market Strategy:**
- Focus on crops with stable or rising prices
- Consider storage options for better returns
- Plan crop rotation for sustained profitability`
    : "Market data is currently unavailable. Consult local mandis for current prices."
}

## Soil-Specific Guidance

### For ${userProfile.soilType} Soil:

**Fertilizer Recommendations:**
${
  userProfile.soilType === "Alluvial"
    ? "- NPK ratio: 120:60:40 kg/ha for cereals\n- Add organic manure: 10-15 tons/ha\n- Micronutrients: Zinc and Boron as needed"
    : userProfile.soilType === "Black"
      ? "- NPK ratio: 100:50:50 kg/ha\n- Gypsum application for calcium\n- Organic matter: 8-10 tons/ha"
      : userProfile.soilType === "Red"
        ? "- NPK ratio: 80:40:40 kg/ha\n- Lime application to reduce acidity\n- Organic compost: 12-15 tons/ha"
        : userProfile.soilType === "Laterite"
          ? "- NPK ratio: 60:30:30 kg/ha\n- Heavy organic matter addition\n- Lime for pH correction"
          : "- Organic matter is crucial\n- Minimal chemical fertilizers\n- Focus on water conservation"
}

**Soil Preparation:**
- Deep ploughing before monsoon
- Add organic matter to improve soil structure
- Ensure proper drainage systems
- Test soil pH and nutrient levels annually

## Action Checklist

✓ Check weather forecast daily
✓ Prepare irrigation schedule
✓ Source quality seeds for recommended crops
✓ Arrange fertilizers and organic manure
✓ Inspect and maintain farm equipment
✓ Monitor market prices regularly
✓ Plan crop rotation for next season

---

**Note**: This is a general recommendation. For specific advice tailored to your exact farm conditions, please consult with local agricultural extension officers or agronomists.

*Generated for ${userProfile.username} | ${new Date().toLocaleDateString("en-IN")}*`
        }

        // Wait before retry
        if (retryCount <= maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 2000 * retryCount))
        }
      }
    }

    return NextResponse.json({
      success: true,
      recommendation: text,
      context: {
        weather: weatherData?.current,
        topCommodities: marketData?.slice(0, 3),
        userProfile: {
          name: userProfile.username,
          state: userProfile.state,
          soilType: userProfile.soilType,
        },
      },
    })
  } catch (error) {
    console.error("[v0] Recommendation generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate recommendation. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}


