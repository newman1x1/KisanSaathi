"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { SchemeCard } from "@/components/scheme-card"
import { governmentSchemes, type Scheme } from "@/lib/gov-schemes"
import { useAppStore } from "@/lib/store"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Search, Sparkles, Loader2, Shield, AlertCircle } from "lucide-react"
import { isAuthenticated } from "@/lib/db"

interface AISearchResult extends Scheme {
  aiExplanation?: string
  relevanceScore?: number
}

export default function SchemesPage() {
  const router = useRouter()
  const { userProfile } = useAppStore()
  const [isLoading, setIsLoading] = useState(true)
  const [simpleSearchQuery, setSimpleSearchQuery] = useState("")
  const [aiSearchQuery, setAiSearchQuery] = useState("")
  const [isAiSearching, setIsAiSearching] = useState(false)
  const [aiSearchResults, setAiSearchResults] = useState<AISearchResult[] | null>(null)
  const [aiSearchError, setAiSearchError] = useState<string | null>(null)
  const [showAiResults, setShowAiResults] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated()
        if (!authenticated) {
          router.push("/auth")
          return
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/auth")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  // Simple search filtering
  const filteredSchemes = useMemo(() => {
    if (!simpleSearchQuery.trim()) {
      return governmentSchemes
    }

    const query = simpleSearchQuery.toLowerCase()
    return governmentSchemes.filter((scheme) => {
      return (
        scheme.title.toLowerCase().includes(query) ||
        scheme.description.toLowerCase().includes(query) ||
        scheme.objective.toLowerCase().includes(query) ||
        scheme.keywords.some((keyword) => keyword.toLowerCase().includes(query)) ||
        scheme.benefits.some((benefit) => benefit.toLowerCase().includes(query))
      )
    })
  }, [simpleSearchQuery])

  // AI search handler
  const handleAiSearch = async () => {
    if (!aiSearchQuery.trim()) {
      setAiSearchError("Please enter a search query")
      return
    }

    setIsAiSearching(true)
    setAiSearchError(null)
    setShowAiResults(true)

    try {
      const response = await fetch("/api/find-schemes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: aiSearchQuery,
          userProfile: userProfile,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to search schemes")
      }

      setAiSearchResults(data.schemes)
    } catch (error) {
      console.error("AI search failed:", error)
      setAiSearchError(error instanceof Error ? error.message : "Failed to search schemes")
      setAiSearchResults(null)
    } finally {
      setIsAiSearching(false)
    }
  }

  const handleResetAiSearch = () => {
    setShowAiResults(false)
    setAiSearchResults(null)
    setAiSearchQuery("")
    setAiSearchError(null)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Loader2 className="h-12 w-12 animate-spin text-green-600" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-emerald-600" />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                    Government Schemes
                  </h1>
                  <p className="text-sm text-muted-foreground">Subsidy & Financial Assistance Programs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <Card className="p-6 border-2 border-emerald-100 shadow-lg">
            <div className="space-y-6">
              {/* Simple Search */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Quick Search
                </label>
                <Input
                  type="text"
                  placeholder="Search by title, benefits, or keywords..."
                  value={simpleSearchQuery}
                  onChange={(e) => setSimpleSearchQuery(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Real-time filtering • {filteredSchemes.length} scheme{filteredSchemes.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {/* AI Search */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-50 to-pink-100 opacity-50 rounded-lg -z-10 blur-sm"></div>
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-2 border-blue-200">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    AI-Powered Search
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="e.g., 'I need help with buying equipment' or 'looking for pension schemes'"
                      value={aiSearchQuery}
                      onChange={(e) => setAiSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAiSearch()}
                      className="flex-1"
                      disabled={isAiSearching}
                    />
                    <Button
                      onClick={handleAiSearch}
                      disabled={isAiSearching || !aiSearchQuery.trim()}
                      className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isAiSearching ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Search with AI
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    AI will analyze your query and profile to find the most relevant schemes for you
                  </p>
                  {showAiResults && (
                    <Button
                      onClick={handleResetAiSearch}
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                    >
                      ← Back to all schemes
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* AI Search Error */}
        <AnimatePresence>
          {aiSearchError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="p-4 border-2 border-red-200 bg-red-50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900">Search Error</p>
                    <p className="text-sm text-red-700">{aiSearchError}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {showAiResults ? (
            // AI Search Results
            <motion.div
              key="ai-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                  AI-Recommended Schemes
                </h2>
                {aiSearchResults && (
                  <p className="text-sm text-muted-foreground">
                    {aiSearchResults.length} scheme{aiSearchResults.length !== 1 ? "s" : ""} found
                  </p>
                )}
              </div>

              {isAiSearching ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <Sparkles className="h-12 w-12 text-blue-600" />
                  </motion.div>
                  <p className="text-lg font-semibold text-gray-700">AI is analyzing your request...</p>
                  <p className="text-sm text-muted-foreground">Finding the best schemes for you</p>
                </div>
              ) : aiSearchResults && aiSearchResults.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {aiSearchResults.map((scheme) => (
                    <SchemeCard
                      key={scheme.id}
                      scheme={scheme}
                      aiExplanation={scheme.aiExplanation}
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-gray-600">No schemes found matching your query. Try a different search.</p>
                </Card>
              )}
            </motion.div>
          ) : (
            // Simple Search Results
            <motion.div
              key="simple-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {simpleSearchQuery ? "Search Results" : "All Government Schemes"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {filteredSchemes.length} scheme{filteredSchemes.length !== 1 ? "s" : ""} available
                </p>
              </div>

              {filteredSchemes.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredSchemes.map((scheme) => (
                    <SchemeCard key={scheme.id} scheme={scheme} />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-gray-600">No schemes found matching "{simpleSearchQuery}"</p>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
