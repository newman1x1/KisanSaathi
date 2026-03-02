"use client"

import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, TrendingUp, TrendingDown } from "lucide-react"
import { motion } from "framer-motion"

interface ForecastData {
  day: string
  date: string
  maxTemp: number
  minTemp: number
  condition: string
  icon: string
}

interface WeatherForecastChartProps {
  data: ForecastData[]
}

export function WeatherForecastChart({ data }: WeatherForecastChartProps) {
  const chartData = data.map((item) => ({
    day: item.day,
    "Max Temp": item.maxTemp,
    "Min Temp": item.minTemp,
    "Avg Temp": Math.round((item.maxTemp + item.minTemp) / 2),
  }))

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase()
    if (lowerCondition.includes("rain")) return "🌧️"
    if (lowerCondition.includes("cloud")) return "☁️"
    if (lowerCondition.includes("clear") || lowerCondition.includes("sun")) return "☀️"
    if (lowerCondition.includes("snow")) return "❄️"
    if (lowerCondition.includes("thunder")) return "⛈️"
    return "🌤️"
  }

  const maxTemp = Math.max(...data.map((d) => d.maxTemp))
  const minTemp = Math.min(...data.map((d) => d.minTemp))
  const avgTemp = Math.round(data.reduce((sum, d) => sum + (d.maxTemp + d.minTemp) / 2, 0) / data.length)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 shadow-xl hover:shadow-2xl transition-all">
            <CardContent className="pt-8 pb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base text-muted-foreground mb-2 font-medium">Highest Temperature</p>
                  <p className="text-5xl font-bold text-red-600">{maxTemp}°C</p>
                </div>
                <div className="p-5 bg-red-100 rounded-full shadow-lg">
                  <TrendingUp className="h-10 w-10 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 shadow-xl hover:shadow-2xl transition-all">
            <CardContent className="pt-8 pb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base text-muted-foreground mb-2 font-medium">Lowest Temperature</p>
                  <p className="text-5xl font-bold text-blue-600">{minTemp}°C</p>
                </div>
                <div className="p-5 bg-blue-100 rounded-full shadow-lg">
                  <TrendingDown className="h-10 w-10 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all">
            <CardContent className="pt-8 pb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base text-muted-foreground mb-2 font-medium">Average Temperature</p>
                  <p className="text-5xl font-bold text-purple-600">{avgTemp}°C</p>
                </div>
                <div className="p-5 bg-purple-100 rounded-full shadow-lg">
                  <Cloud className="h-10 w-10 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card className="border-2 border-blue-100 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50 pb-6">
          <CardTitle className="flex items-center gap-3 text-blue-900 text-3xl">
            <Cloud className="h-8 w-8" />
            7-Day Temperature Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-10 pb-10">
          <ResponsiveContainer width="100%" height={500}>
            <AreaChart data={chartData} margin={{ top: 20, right: 40, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="maxTempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="minTempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="avgTempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.6} />
              <XAxis
                dataKey="day"
                stroke="#6b7280"
                style={{ fontSize: "16px", fontWeight: 700 }}
                tick={{ fill: "#374151" }}
                height={60}
              />
              <YAxis
                label={{
                  value: "Temperature (°C)",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "#374151", fontWeight: 700, fontSize: "16px" },
                }}
                stroke="#6b7280"
                style={{ fontSize: "16px", fontWeight: 600 }}
                tick={{ fill: "#374151" }}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.98)",
                  border: "2px solid #e5e7eb",
                  borderRadius: "16px",
                  boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)",
                  padding: "16px",
                  fontSize: "15px",
                }}
                labelStyle={{ fontWeight: 700, color: "#1f2937", marginBottom: "10px", fontSize: "16px" }}
              />
              <Legend
                wrapperStyle={{ paddingTop: "32px", fontSize: "15px" }}
                iconType="circle"
                iconSize={14}
                formatter={(value) => <span style={{ fontWeight: 700, color: "#374151" }}>{value}</span>}
              />
              <Area
                type="monotone"
                dataKey="Max Temp"
                stroke="#ef4444"
                strokeWidth={4}
                fill="url(#maxTempGradient)"
                dot={{ fill: "#ef4444", r: 7, strokeWidth: 3, stroke: "#fff" }}
                activeDot={{ r: 10, strokeWidth: 3 }}
              />
              <Area
                type="monotone"
                dataKey="Avg Temp"
                stroke="#8b5cf6"
                strokeWidth={3}
                strokeDasharray="6 6"
                fill="url(#avgTempGradient)"
                dot={{ fill: "#8b5cf6", r: 5, strokeWidth: 2, stroke: "#fff" }}
              />
              <Area
                type="monotone"
                dataKey="Min Temp"
                stroke="#3b82f6"
                strokeWidth={4}
                fill="url(#minTempGradient)"
                dot={{ fill: "#3b82f6", r: 7, strokeWidth: 3, stroke: "#fff" }}
                activeDot={{ r: 10, strokeWidth: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
