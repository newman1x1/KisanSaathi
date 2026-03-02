"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface MarketPriceData {
  commodity: string
  price: number
}

interface MarketPricesChartProps {
  data: MarketPriceData[]
}

export function MarketPricesChart({ data }: MarketPricesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="commodity" angle={-45} textAnchor="end" height={100} />
        <YAxis label={{ value: "Price (₹/quintal)", angle: -90, position: "insideLeft" }} />
        <Tooltip formatter={(value) => `₹${value}/quintal`} />
        <Legend />
        <Bar dataKey="price" fill="#22c55e" name="Modal Price" />
      </BarChart>
    </ResponsiveContainer>
  )
}
