import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")

    if (!lat || !lon) {
      return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
    }

    const apiKey = process.env.OPENWEATHERMAP_API_KEY

    if (!apiKey) {
      console.error("[v0] OpenWeatherMap API key not configured")
      return NextResponse.json({ error: "Weather service not configured" }, { status: 500 })
    }

    // Fetch current weather (free API)
    const currentWeatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
    )

    // Fetch 5-day forecast (free API)
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
    )

    if (!currentWeatherResponse.ok || !forecastResponse.ok) {
      console.error("[v0] OpenWeatherMap API error")
      return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
    }

    const currentData = await currentWeatherResponse.json()
    const forecastData = await forecastResponse.json()

    // Process forecast data to get daily forecasts (one per day at noon)
    const dailyForecasts = forecastData.list
      .filter((item: any) => item.dt_txt.includes("12:00:00"))
      .slice(0, 7)
      .map((day: any) => ({
        day: new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "short" }),
        date: new Date(day.dt * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        maxTemp: Math.round(day.main.temp_max),
        minTemp: Math.round(day.main.temp_min),
        condition: day.weather[0].main,
        icon: day.weather[0].icon,
      }))

    // Transform to curated response
    const curatedResponse = {
      current: {
        temp: Math.round(currentData.main.temp),
        condition: currentData.weather[0].main,
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
        humidity: currentData.main.humidity,
        windSpeed: currentData.wind.speed,
      },
      forecast: dailyForecasts,
    }

    return NextResponse.json(curatedResponse)
  } catch (error) {
    console.error("[v0] Weather API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
