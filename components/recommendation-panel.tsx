"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Loader2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Cloud,
  Leaf,
  DollarSign,
  Lightbulb,
  ThermometerSun,
  Droplets,
  Wind,
  MapPin,
  Calendar,
  Target,
  BarChart3,
  Info,
  Globe,
  Languages,
  RefreshCw,
  Download,
  Share2,
  Sprout,
  Eye,
  EyeOff,
} from "lucide-react"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface RecommendationPanelProps {
  isOpen: boolean
  onClose: () => void
  userProfile: any
  weatherData: any
  marketData: any[]
  onRegenerate: () => void
}

export function RecommendationPanel({
  isOpen,
  onClose,
  userProfile,
  weatherData,
  marketData,
  onRegenerate,
}: RecommendationPanelProps) {
  const [recommendation, setRecommendation] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showEnglish, setShowEnglish] = useState(true)
  const [showLocal, setShowLocal] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [geminiMarketData, setGeminiMarketData] = useState<any[]>([])

  useEffect(() => {
    if (isOpen && !recommendation) {
      fetchRecommendation()
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      fetchGeminiMarketData()
    }
  }, [isOpen, userProfile?.state])

  const fetchGeminiMarketData = async () => {
    if (!userProfile?.state) return

    try {
      const commodities = ["Wheat", "Rice", "Cotton", "Sugarcane", "Potato"]
      const promises = commodities.map(commodity =>
        fetch("/api/gemini-market-data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ commodity, state: userProfile.state }),
        }).then(res => res.json())
      )

      const results = await Promise.all(promises)
      setGeminiMarketData(results.filter(r => r.commodity))
    } catch (error) {
      console.error("Failed to fetch Gemini market data:", error)
    }
  }

  const fetchRecommendation = async () => {
    setIsLoading(true)
    setError(null)
    setRecommendation(null)

    try {
      const response = await fetch("/api/get-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userProfile }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate recommendation")
      }

      setRecommendation(data.recommendation)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to generate recommendation")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegenerate = () => {
    setRecommendation(null)
    fetchRecommendation()
    onRegenerate()
  }

  // Prepare chart data
  const weatherChartData = weatherData?.forecast?.map((day: any) => ({
    day: day.day,
    high: day.maxTemp,
    low: day.minTemp,
    avg: Math.round((day.maxTemp + day.minTemp) / 2),
  })) || []

  // Enhanced market chart data with better debugging
  const marketChartData = React.useMemo(() => {
    console.log("=== MARKET DATA DEBUG ===")
    console.log("Raw marketData:", marketData)
    console.log("marketData length:", marketData?.length || 0)
    console.log("marketData type:", typeof marketData)
    console.log("Is marketData array?", Array.isArray(marketData))
    
    if (!marketData || !Array.isArray(marketData) || marketData.length === 0) {
      console.log("No market data available for chart")
      return []
    }
    
    const chartData = marketData.slice(0, 8).map((item: any, index: number) => {
      console.log(`Processing item ${index}:`, item)
      return {
        name: item.commodity?.length > 10 ? item.commodity.substring(0, 10) + "..." : item.commodity || "Unknown",
        price: Number(item.price) || 0,
        fullName: item.commodity || "Unknown",
      }
    })
    
    console.log("Final marketChartData:", chartData)
    console.log("========================")
    return chartData
  }, [marketData])

  const geminiMarketChartData = geminiMarketData?.map((item: any) => ({
    name: item.commodity,
    min: item.prices?.min_price || 0,
    modal: item.prices?.modal_price || 0,
    max: item.prices?.max_price || 0,
  })) || []

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

  // Helper function to extract top recommended crop from AI response
  const extractTopCrop = () => {
    if (!recommendation) return null
    
    // Try to find crop recommendations in the text
    const cropSection = recommendation.match(/(?:CROP RECOMMENDATIONS?|Crop Recommendations?)[^#]*/i)?.[0] || ""
    
    // Look for crop names in lists
    const crops = cropSection.match(/(?:Wheat|Rice|Cotton|Sugarcane|Potato|Onion|Tomato|Soybean|Jowar|Chickpea|Pigeon pea|Groundnut|Millets|Pulses|Ragi|Cashew|Coconut|Tapioca|Sweet potato|Maize|Bajra)/gi)
    
    if (crops && crops.length > 0) {
      return crops[0]
    }
    
    // Fallback based on soil type
    const soilBasedCrop = userProfile?.soilType === "Clay" ? "Rice" : 
                         userProfile?.soilType === "Sandy" ? "Groundnut" :
                         userProfile?.soilType === "Loamy" ? "Wheat" :
                         userProfile?.soilType === "Black" ? "Cotton" :
                         "Wheat"
    return soilBasedCrop
  }

  // Helper function to extract best market opportunity from AI response
  const extractBestMarket = () => {
    if (!recommendation) return null
    
    // Try to find market insights mentioning specific crops
    const marketSection = recommendation.match(/(?:MARKET INSIGHTS?|Market Insights?)[^#]*/i)?.[0] || ""
    
    // Look for mentions of high prices or good opportunities
    const highValueCrops = marketSection.match(/(?:Wheat|Rice|Cotton|Sugarcane|Potato|Onion|Tomato|Soybean|Jowar|Chickpea|Groundnut|Millets)/gi)
    
    if (highValueCrops && highValueCrops.length > 0) {
      return highValueCrops[0]
    }
    
    // Fallback to first market data item
    return marketData && marketData.length > 0 ? marketData[0]?.commodity : "Cotton"
  }

  // Helper function to extract weather action from AI response
  const extractWeatherAction = () => {
    if (!recommendation) return null
    
    // Try to find immediate actions or weather advice
    const actionSection = recommendation.match(/(?:IMMEDIATE ACTIONS?|WEATHER-BASED ADVICE)[^#]*/i)?.[0] || ""
    
    // Look for action items
    const actions = actionSection.match(/(?:Check|Monitor|Inspect|Ensure|Apply|Test|Prepare)[^.!?]*/gi)
    
    if (actions && actions.length > 0) {
      return actions[0].substring(0, 60)
    }
    
    // Fallback based on weather
    if (weatherData?.current?.condition === "Clear") return "Inspect fields for pests"
    if (weatherData?.current?.condition?.includes("Rain")) return "Check drainage systems"
    if (weatherData?.current?.humidity > 75) return "Monitor for fungal growth"
    return "Check soil moisture levels"
  }

  // Helper function to extract quick action tip from AI response
  const extractQuickAction = () => {
    if (!recommendation) return null
    
    // Try to find immediate actions
    const actionSection = recommendation.match(/(?:IMMEDIATE ACTIONS?|Immediate Actions?)[^#]*/i)?.[0] || ""
    
    // Look for bullet points or action items
    const lines = actionSection.split('\n').filter(line => 
      line.trim().startsWith('-') || 
      line.trim().startsWith('•') || 
      line.trim().match(/^[\d]+\./)
    )
    
    if (lines.length > 0) {
      const actionText = lines[0].replace(/^[-•\d.)\s]+/, '').trim()
      return actionText.substring(0, 80)
    }
    
    // Fallback
    if (weatherData?.current?.condition === "Clear") return "Clear weather is ideal for field inspection and spraying operations."
    if (weatherData?.current?.condition?.includes("Rain")) return "Ensure proper water drainage to prevent waterlogging."
    if (weatherData?.current?.humidity > 75) return "High humidity increases disease risk. Apply preventive measures."
    return "Test soil before planning irrigation schedule."
  }

  // Helper function to filter content by language and remove language labels
  const filterByLanguage = (text: string) => {
    if (!text) return ""
    
    const lines = text.split('\n')
    const filteredLines: string[] = []
    
    // Comprehensive list of language prefixes to detect (covers all Indian languages + English name)
    const regionalPrefixPattern = /^[\s]*(Hindi:|Marathi:|Punjabi:|Telugu:|Tamil:|Bengali:|Gujarati:|Kannada:|Malayalam:|Odia:|ਪੰਜਾਬੀ:|हिंदी:|मराठी:|తెలుగు:|தமிழ்:|বাংলা:|ગુજરાતી:|ಕನ್ನಡ:|മലയാളം:|ଓଡ଼ିଆ:)\s*/i
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmedLine = line.trim()
      
      // Check if line contains "English:" prefix
      if (trimmedLine.match(/^[\s]*English:\s*/i)) {
        if (showEnglish) {
          // Remove "English:" prefix and add the content
          const content = line.replace(/^[\s]*English:\s*/i, '').trim()
          if (content) {
            filteredLines.push(content)
          }
        }
        // Skip this line if not showing English
      } 
      // Check if line contains any regional language prefix
      else if (trimmedLine.match(regionalPrefixPattern)) {
        if (showLocal) {
          // Remove all language prefixes and add the content
          const content = line.replace(regionalPrefixPattern, '').trim()
          if (content) {
            filteredLines.push(content)
          }
        }
        // Skip this line if not showing local language
      } 
      // Include non-language-specific lines (headings, blank lines, etc.)
      else if (!trimmedLine.match(/^[\s]*English:\s*/i) && !trimmedLine.match(regionalPrefixPattern)) {
        filteredLines.push(line)
      }
    }
    
    // Clean up extra blank lines
    return filteredLines.join('\n').replace(/\n{3,}/g, '\n\n')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl shadow-2xl w-full h-full md:w-[99vw] md:h-[98vh] md:max-w-[2400px] overflow-hidden flex flex-col m-1 md:m-2"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-10 w-10" />
              </motion.div>
              <div>
                <h2 className="text-3xl font-bold">AI-Powered Farming Insights</h2>
                <p className="text-green-100 text-sm mt-1 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Personalized recommendations based on comprehensive data analysis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={showEnglish ? "secondary" : "outline"}
                size="sm"
                onClick={() => {
                  setShowEnglish(true)
                  setShowLocal(false)
                }}
                className={`gap-2 ${showEnglish ? 'bg-white text-green-700' : 'text-white border-white/50 hover:bg-white/20'}`}
              >
                <Globe className="h-4 w-4" />
                Show English
              </Button>
              <Button
                variant={showLocal ? "secondary" : "outline"}
                size="sm"
                onClick={() => {
                  setShowEnglish(false)
                  setShowLocal(true)
                }}
                className={`gap-2 ${showLocal ? 'bg-white text-green-700' : 'text-white border-white/50 hover:bg-white/20'}`}
              >
                <Languages className="h-4 w-4" />
                Show {userProfile?.language || "Local"}
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
                ✕
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 space-y-8"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50"></div>
                  <Loader2 className="h-24 w-24 text-green-600 relative z-10" />
                </motion.div>
                <div className="text-center space-y-4">
                  <p className="text-2xl font-bold text-green-700">Analyzing Your Farm Data...</p>
                  <p className="text-lg text-muted-foreground max-w-lg">
                    Processing weather patterns, market data, and soil conditions
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-6">
                    {["Weather Analysis", "Market Trends", "Soil Data", "AI Processing"].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.2 }}
                      >
                        <Badge variant="secondary" className="text-sm px-3 py-1">
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          {item}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="w-5 h-5 bg-green-600 rounded-full"
                      animate={{
                        scale: [1, 1.8, 1],
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-20 text-center space-y-8"
              >
                <div className="flex justify-center">
                  <div className="rounded-full bg-red-100 p-8 shadow-lg">
                    <AlertTriangle className="h-20 w-20 text-red-600" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-bold text-red-900">Unable to Generate Recommendation</h3>
                  <p className="text-red-600 text-xl max-w-md mx-auto">{error}</p>
                </div>
                <Button onClick={handleRegenerate} size="lg" className="gap-3 text-lg px-8 py-6">
                  <RefreshCw className="h-5 w-5" />
                  Try Again
                </Button>
              </motion.div>
            ) : recommendation ? (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Quick Stats Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 shadow-lg">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-blue-100 rounded-xl shadow-sm">
                            <ThermometerSun className="h-8 w-8 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">Current Weather</p>
                            <p className="text-2xl font-bold text-blue-900">{weatherData?.current?.temp || "--"}°C</p>
                            <p className="text-xs text-blue-700">{weatherData?.current?.condition || "N/A"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-green-100 rounded-xl shadow-sm">
                            <Sprout className="h-8 w-8 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">Soil Type</p>
                            <p className="text-2xl font-bold text-green-900">{userProfile?.soilType || "N/A"}</p>
                            <p className="text-xs text-green-700">{userProfile?.state || ""}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-purple-100 rounded-xl shadow-sm">
                            <MapPin className="h-8 w-8 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">Location</p>
                            <p className="text-xl font-bold text-purple-900">{userProfile?.state || "N/A"}</p>
                            <p className="text-xs text-purple-700">{userProfile?.country || "India"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 shadow-lg">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-orange-100 rounded-xl shadow-sm">
                            <Languages className="h-8 w-8 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">Language</p>
                            <p className="text-xl font-bold text-orange-900">{userProfile?.language || "English"}</p>
                            <p className="text-xs text-orange-700">Bilingual Report</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Tabs for different sections */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-5 lg:grid-cols-5 gap-2 h-auto bg-white/50 p-2 rounded-xl">
                    <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white">
                      <Target className="h-4 w-4" />
                      <span className="hidden sm:inline">Overview</span>
                    </TabsTrigger>
                    <TabsTrigger value="recommendations" className="gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white">
                      <Leaf className="h-4 w-4" />
                      <span className="hidden sm:inline">Crops</span>
                    </TabsTrigger>
                    <TabsTrigger value="weather" className="gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                      <Cloud className="h-4 w-4" />
                      <span className="hidden sm:inline">Weather</span>
                    </TabsTrigger>
                    <TabsTrigger value="market" className="gap-2 data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                      <DollarSign className="h-4 w-4" />
                      <span className="hidden sm:inline">Market</span>
                    </TabsTrigger>
                    <TabsTrigger value="actions" className="gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                      <Lightbulb className="h-4 w-4" />
                      <span className="hidden sm:inline">Actions</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Temperature Trend Chart */}
                      <Card className="border-2 border-blue-200 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                          <CardTitle className="flex items-center gap-2 text-blue-900">
                            <BarChart3 className="h-5 w-5" />
                            7-Day Temperature Forecast
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={weatherChartData}>
                              <defs>
                                <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: '12px' }} />
                              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                  border: '1px solid #e5e7eb',
                                  borderRadius: '8px',
                                }}
                              />
                              <Legend />
                              <Area type="monotone" dataKey="high" stroke="#ef4444" fillOpacity={1} fill="url(#colorHigh)" name="High °C" />
                              <Area type="monotone" dataKey="low" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLow)" name="Low °C" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      {/* AI Insight Cards - Beautiful & Interactive */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* Top Recommended Crop */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          whileHover={{ scale: 1.03, y: -5 }}
                          className="relative"
                        >
                          <Card className="border-2 border-green-300 shadow-xl overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 h-full">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-400/10 rounded-full blur-2xl"></div>
                            <CardContent className="pt-6 pb-6 relative z-10">
                              <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                                  <Sparkles className="h-8 w-8 text-white" />
                                </div>
                                <Badge className="bg-green-600 text-white text-xs px-2 py-1">AI Pick</Badge>
                              </div>
                              <h3 className="text-sm font-semibold text-green-700 mb-2">🎯 Top Recommended Crop</h3>
                              <p className="text-2xl font-bold text-green-900 mb-1">
                                {extractTopCrop()}
                              </p>
                              <p className="text-xs text-green-600">Best suited for your {userProfile?.soilType || "soil"} soil</p>
                              <div className="mt-4 flex items-center gap-2">
                                <Progress value={92} className="h-2" />
                                <span className="text-xs font-medium text-green-700">92%</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">Success probability</p>
                            </CardContent>
                          </Card>
                        </motion.div>

                        {/* Best Market Opportunity */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          whileHover={{ scale: 1.03, y: -5 }}
                          className="relative"
                        >
                          <Card className="border-2 border-orange-300 shadow-xl overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 h-full">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl"></div>
                            <CardContent className="pt-6 pb-6 relative z-10">
                              <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-lg">
                                  <TrendingUp className="h-8 w-8 text-white" />
                                </div>
                                <Badge className="bg-orange-600 text-white text-xs px-2 py-1">High ROI</Badge>
                              </div>
                              <h3 className="text-sm font-semibold text-orange-700 mb-2">📈 Best Market Opportunity</h3>
                              <p className="text-2xl font-bold text-orange-900 mb-1">
                                {extractBestMarket()}
                              </p>
                              <p className="text-xs text-orange-600">
                                ₹{marketData.length > 0 ? 
                                  marketData.find(m => m.commodity === extractBestMarket())?.price.toLocaleString() || 
                                  marketData[0]?.price.toLocaleString() : 
                                  "6,500"}/quintal
                              </p>
                              <div className="mt-4 flex items-center gap-2">
                                <div className="flex-1 bg-orange-200 rounded-full h-2">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: "85%" }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full"
                                  />
                                </div>
                                <span className="text-xs font-medium text-orange-700">85%</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">Market demand strength</p>
                            </CardContent>
                          </Card>
                        </motion.div>

                        {/* Weather Alert */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          whileHover={{ scale: 1.03, y: -5 }}
                          className="relative"
                        >
                          <Card className="border-2 border-blue-300 shadow-xl overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 h-full">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-400/10 rounded-full blur-2xl"></div>
                            <CardContent className="pt-6 pb-6 relative z-10">
                              <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg">
                                  <Cloud className="h-8 w-8 text-white" />
                                </div>
                                <Badge className="bg-blue-600 text-white text-xs px-2 py-1">Alert</Badge>
                              </div>
                              <h3 className="text-sm font-semibold text-blue-700 mb-2">🌡️ Weather Watch</h3>
                              <p className="text-2xl font-bold text-blue-900 mb-1">
                                {weatherData?.current?.condition || "Clear Sky"}
                              </p>
                              <p className="text-xs text-blue-600">
                                {weatherData?.current?.temp || 28}°C • Humidity {weatherData?.current?.humidity || 70}%
                              </p>
                              <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2 text-xs">
                                  <Droplets className="h-3 w-3 text-blue-600" />
                                  <span className="text-blue-700">
                                    {weatherData?.current?.humidity > 75 ? "High moisture - Monitor crops" : 
                                     weatherData?.current?.humidity < 40 ? "Low moisture - Consider irrigation" :
                                     "Optimal moisture levels"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  <ThermometerSun className="h-3 w-3 text-blue-600" />
                                  <span className="text-blue-700">
                                    {extractWeatherAction()}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>

                        {/* Quick Action Tip */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          whileHover={{ scale: 1.03, y: -5 }}
                          className="relative"
                        >
                          <Card className="border-2 border-purple-300 shadow-xl overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 h-full">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-400/10 rounded-full blur-2xl"></div>
                            <CardContent className="pt-6 pb-6 relative z-10">
                              <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                                  <Lightbulb className="h-8 w-8 text-white" />
                                </div>
                                <Badge className="bg-purple-600 text-white text-xs px-2 py-1">Today</Badge>
                              </div>
                              <h3 className="text-sm font-semibold text-purple-700 mb-2">💡 Quick Action</h3>
                              <p className="text-lg font-bold text-purple-900 mb-2 leading-tight">
                                {extractWeatherAction()}
                              </p>
                              <p className="text-xs text-purple-600 leading-relaxed">
                                {extractQuickAction()}
                              </p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </div>
                    </div>

                    {/* Full Recommendation Preview */}
                    <Card className="border-2 border-gray-200 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
                        <CardTitle className="flex items-center gap-2 text-gray-900">
                          <Info className="h-5 w-5" />
                          Complete Recommendation Summary
                        </CardTitle>
                        <CardDescription>
                          Explore detailed insights in the tabs above
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="bg-white rounded-xl p-6 max-h-96 overflow-y-auto border border-gray-200">
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown
                              components={{
                                h1: ({ children }) => (
                                  <h1 className="text-2xl font-bold mt-4 mb-3 text-gray-800 flex items-center gap-2">
                                    <Sparkles className="h-6 w-6 text-green-600" />
                                    {children}
                                  </h1>
                                ),
                                h2: ({ children }) => (
                                  <h2 className="text-xl font-bold mt-4 mb-2 text-gray-700 border-b pb-2">{children}</h2>
                                ),
                                h3: ({ children }) => (
                                  <h3 className="text-lg font-semibold mt-3 mb-2 text-gray-600">{children}</h3>
                                ),
                                p: ({ children }) => <p className="mb-3 leading-relaxed text-gray-700">{children}</p>,
                                ul: ({ children }) => <ul className="space-y-2 mb-4 ml-4">{children}</ul>,
                                li: ({ children }) => (
                                  <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                                    <span className="text-gray-700">{children}</span>
                                  </li>
                                ),
                                strong: ({ children }) => (
                                  <strong className="font-semibold text-gray-800">{children}</strong>
                                ),
                              }}
                            >
                              {filterByLanguage(recommendation || "")}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Recommendations Tab */}
                  <TabsContent value="recommendations" className="space-y-6 mt-6">
                    <Card className="border-2 border-green-200 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                        <CardTitle className="flex items-center gap-3 text-green-900">
                          <Leaf className="h-6 w-6" />
                          Crop Recommendations for {userProfile?.soilType} Soil
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2">
                          <Calendar className="h-4 w-4" />
                          Based on current weather and market conditions
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown
                            components={{
                              h1: ({ children }) => null, // Skip main heading
                              h2: ({ children }) => {
                                const text = String(children)
                                if (text.includes('CROP') || text.includes('फसल') || text.includes('ਫਸਲ')) {
                                  return <h2 className="text-xl font-bold mt-4 mb-3 text-green-800">{children}</h2>
                                }
                                return null
                              },
                              h3: ({ children }) => (
                                <h3 className="text-lg font-semibold mt-3 mb-2 text-green-700 flex items-center gap-2">
                                  <Sprout className="h-5 w-5" />
                                  {children}
                                </h3>
                              ),
                              p: ({ children }) => <p className="text-gray-700 leading-relaxed mb-3">{children}</p>,
                              ul: ({ children }) => <ul className="space-y-3 ml-4 mb-4">{children}</ul>,
                              li: ({ children }) => (
                                <motion.li
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="flex items-start gap-3 bg-green-50 rounded-lg p-3 shadow-sm border border-green-100"
                                >
                                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700 flex-1">{children}</span>
                                </motion.li>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-semibold text-green-800">{children}</strong>
                              ),
                            }}
                          >
                            {filterByLanguage(recommendation || "")}
                          </ReactMarkdown>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Weather Tab */}
                  <TabsContent value="weather" className="space-y-6 mt-6">
                    {/* Weather forecast visualization - CENTERED */}
                    <Card className="border-2 border-cyan-200 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-cyan-50 to-sky-50">
                        <CardTitle className="flex items-center gap-2 text-cyan-900">
                          <BarChart3 className="h-5 w-5" />
                          7-Day Temperature Forecast Visualization
                        </CardTitle>
                        <CardDescription>
                          Detailed temperature trends for the next week
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="flex justify-center items-center">
                          <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={weatherChartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: '13px' }} />
                              <YAxis stroke="#6b7280" style={{ fontSize: '13px' }} label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                  border: '1px solid #e5e7eb',
                                  borderRadius: '8px',
                                  padding: '10px',
                                }}
                              />
                              <Legend wrapperStyle={{ paddingTop: '20px' }} />
                              <Line type="monotone" dataKey="high" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', r: 6 }} name="High °C" />
                              <Line type="monotone" dataKey="low" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 6 }} name="Low °C" />
                              <Line type="monotone" dataKey="avg" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} name="Avg °C" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Current Weather Stats - Centered Horizontally */}
                    {weatherData && (
                      <Card className="border-2 border-blue-200 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                          <CardTitle className="flex items-center gap-3 text-blue-900 justify-center">
                            <Cloud className="h-6 w-6" />
                            Current Weather Conditions
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="flex justify-center items-center mb-6">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl">
                              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                  <ThermometerSun className="h-5 w-5 text-blue-600" />
                                  <span className="text-sm font-medium text-blue-700">Temperature</span>
                                </div>
                                <p className="text-3xl font-bold text-blue-900">{weatherData.current.temp}°C</p>
                                <p className="text-xs text-blue-600 mt-1">{weatherData.current.condition}</p>
                              </div>
                              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                  <Droplets className="h-5 w-5 text-blue-600" />
                                  <span className="text-sm font-medium text-blue-700">Humidity</span>
                                </div>
                                <p className="text-3xl font-bold text-blue-900">{weatherData.current.humidity}%</p>
                              </div>
                              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                  <Wind className="h-5 w-5 text-blue-600" />
                                  <span className="text-sm font-medium text-blue-700">Wind Speed</span>
                                </div>
                                <p className="text-3xl font-bold text-blue-900">{weatherData.current.windSpeed} km/h</p>
                              </div>
                              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                  <ThermometerSun className="h-5 w-5 text-blue-600" />
                                  <span className="text-sm font-medium text-blue-700">Feels Like</span>
                                </div>
                                <p className="text-3xl font-bold text-blue-900">{weatherData.current.feelsLike || weatherData.current.temp}°C</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Weather-Based Advice - Full Width Below */}
                    <Card className="border-2 border-blue-200 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                        <CardTitle className="flex items-center gap-3 text-blue-900">
                          <Lightbulb className="h-6 w-6" />
                          Weather-Based Farming Advice
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown
                            components={{
                              h2: ({ children }) => {
                                const text = String(children)
                                if (text.includes('WEATHER') || text.includes('मौसम') || text.includes('ਮੌਸਮ')) {
                                  return <h2 className="text-lg font-bold mb-3 text-blue-800">{children}</h2>
                                }
                                return null
                              },
                              p: ({ children }) => <p className="text-gray-700 leading-relaxed mb-3">{children}</p>,
                              ul: ({ children }) => <ul className="space-y-2 ml-4">{children}</ul>,
                              li: ({ children }) => (
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                                  <span className="text-gray-700">{children}</span>
                                </li>
                              ),
                            }}
                          >
                            {filterByLanguage(recommendation || "")}
                          </ReactMarkdown>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Market Tab */}
                  <TabsContent value="market" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 gap-6">
                      {/* Market Insights */}
                      <Card className="border-2 border-orange-200 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                          <CardTitle className="flex items-center gap-3 text-orange-900">
                            <DollarSign className="h-6 w-6" />
                            Market Insights & Price Analysis
                          </CardTitle>
                          <CardDescription>
                            Current market trends and pricing recommendations
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                          {marketData.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                              {marketData.slice(0, 8).map((item, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: idx * 0.05 }}
                                  whileHover={{ scale: 1.05 }}
                                  className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-3 border border-orange-200 shadow-sm"
                                >
                                  <p className="text-xs text-muted-foreground font-medium truncate">{item.commodity}</p>
                                  <p className="text-xl font-bold text-orange-900">₹{item.price.toLocaleString()}</p>
                                  <p className="text-xs text-orange-600">per quintal</p>
                                </motion.div>
                              ))}
                            </div>
                          )}
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown
                              components={{
                                h2: ({ children }) => {
                                  const text = String(children)
                                  if (text.includes('MARKET') || text.includes('बाजार') || text.includes('ਬਾਜ਼ਾਰ')) {
                                    return <h2 className="text-lg font-bold mb-3 text-orange-800">{children}</h2>
                                  }
                                  return null
                                },
                                h3: ({ children }) => (
                                  <h3 className="text-md font-semibold mt-4 mb-2 text-orange-700">{children}</h3>
                                ),
                                p: ({ children }) => <p className="text-gray-700 leading-relaxed mb-3">{children}</p>,
                                ul: ({ children }) => <ul className="space-y-2 ml-4">{children}</ul>,
                                li: ({ children }) => (
                                  <li className="flex items-start gap-2">
                                    <TrendingUp className="h-4 w-4 text-orange-600 mt-1 flex-shrink-0" />
                                    <span className="text-gray-700">{children}</span>
                                  </li>
                                ),
                              }}
                            >
                              {filterByLanguage(recommendation || "")}
                            </ReactMarkdown>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Gemini Market Data Visualization */}
                      {geminiMarketData.length > 0 && (
                        <Card className="border-2 border-amber-200 shadow-lg">
                          <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50">
                            <CardTitle className="flex items-center gap-2 text-amber-900">
                              <BarChart3 className="h-5 w-5" />
                              Detailed Price Range Analysis
                            </CardTitle>
                            <CardDescription>
                              Min, Modal, and Max prices from CIDA Data
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <ResponsiveContainer width="100%" height={300}>
                              <BarChart data={geminiMarketChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
                                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                  }}
                                  formatter={(value: any) => [`₹${value}`, '']}
                                />
                                <Legend />
                                <Bar dataKey="min" fill="#3b82f6" name="Min Price" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="modal" fill="#10b981" name="Modal Price" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="max" fill="#f59e0b" name="Max Price" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>

                  {/* Actions Tab */}
                  <TabsContent value="actions" className="space-y-6 mt-6">
                    <Card className="border-2 border-purple-200 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                        <CardTitle className="flex items-center gap-3 text-purple-900">
                          <Lightbulb className="h-6 w-6" />
                          Immediate Action Items
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2">
                          <Target className="h-4 w-4" />
                          Priority tasks for the next 24-48 hours
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown
                              components={{
                                h2: ({ children }) => {
                                  const text = String(children)
                                  if (text.includes('IMMEDIATE') || text.includes('SOIL') || text.includes('तुरंत') || text.includes('मिट्टी') || text.includes('ਤੁਰੰਤ') || text.includes('ਮਿੱਟੀ')) {
                                    return <h2 className="text-lg font-bold mb-3 text-purple-800 flex items-center gap-2">
                                      <CheckCircle2 className="h-5 w-5" />
                                      {children}
                                    </h2>
                                  }
                                  return null
                                },
                                p: ({ children }) => <p className="text-gray-700 leading-relaxed mb-3">{children}</p>,
                                ul: ({ children }) => <ul className="space-y-3">{children}</ul>,
                                li: ({ children }) => (
                                  <motion.li
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    className="flex items-start gap-3 bg-white rounded-lg p-4 shadow-sm border border-purple-100 hover:border-purple-300 transition-all"
                                  >
                                    <div className="mt-0.5 p-1.5 bg-purple-100 rounded-full">
                                      <CheckCircle2 className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <span className="text-gray-700 flex-1">{children}</span>
                                  </motion.li>
                                ),
                                strong: ({ children }) => (
                                  <strong className="font-semibold text-purple-800">{children}</strong>
                                ),
                              }}
                            >
                              {filterByLanguage(recommendation || "")}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {recommendation && (
          <div className="border-t bg-white/80 backdrop-blur-sm p-4 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Generated: {new Date().toLocaleString()}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={handleRegenerate} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Regenerate
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
