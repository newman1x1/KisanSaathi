import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ServiceWorkerRegistration } from "@/components/service-worker-registration"
/*import { ChatbotTrigger } from "@/components/chatbot-trigger"*/
import { Suspense } from "react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "KisanSaathi - Your Farming Companion",
  description:
    "AI-powered agricultural assistant providing weather forecasts, market prices, and crop diagnosis for Indian farmers",
  generator: "v0.app",
  manifest: "/manifest.json",
  themeColor: "#4a9d5f",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KisanSaathi",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon-192.jpg" />
        <link rel="apple-touch-icon" href="/icon-192.jpg" />
      </head>
      <body className={`font-sans ${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <Suspense fallback={null}>
          {children}
          <ServiceWorkerRegistration />
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}

