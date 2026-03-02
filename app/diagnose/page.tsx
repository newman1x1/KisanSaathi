"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Upload, Loader2, ArrowLeft, AlertCircle, CheckCircle2, LogOut, User } from "lucide-react"
import { isAuthenticated, getUserProfile, getSession, logout } from "@/lib/db"
import { useAppStore } from "@/lib/store"
import { CameraCapture } from "@/components/camera-capture"
import { AnalysisReport } from "@/components/analysis-report"

export default function DiagnosePage() {
  const router = useRouter()
  const { userProfile, setUserProfile, setIsAuthenticated } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [analysisReport, setAnalysisReport] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [invalidImageReason, setInvalidImageReason] = useState<{ english: string; local: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated()
      if (!authenticated) {
        router.push("/")
        return
      }

      if (!userProfile) {
        const session = await getSession()
        if (session) {
          const profile = await getUserProfile(session.userEmail)
          if (profile) {
            setUserProfile(profile)
          }
        }
      }
    }

    checkAuth()
  }, [router, userProfile, setUserProfile])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB")
      return
    }

    setError(null)
    setInvalidImageReason(null)
    const reader = new FileReader()
    reader.onloadend = () => {
      setSelectedImage(reader.result as string)
      setAnalysisReport(null)
    }
    reader.readAsDataURL(file)
  }

  const handleCameraCapture = (imageData: string) => {
    setSelectedImage(imageData)
    setAnalysisReport(null)
    setError(null)
    setInvalidImageReason(null)
  }

  const handleAnalyze = async () => {
    if (!selectedImage) return

    setIsLoading(true)
    setError(null)
    setInvalidImageReason(null)

    try {
      const response = await fetch("/api/analyze-crop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: selectedImage,
          language: userProfile?.language || "English",
          state: userProfile?.state,
          soilType: userProfile?.soilType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.isInvalidImage) {
          setInvalidImageReason({
            english: data.reason || "This image cannot be analyzed.",
            local: data.reasonLocal || "This image cannot be analyzed for agricultural purposes.",
          })
          setError("Invalid image for crop analysis")
        } else {
          throw new Error(data.error || "Failed to analyze image")
        }
        return
      }

      console.log("[v0] Analysis report received:", data.report?.substring(0, 200))
      setAnalysisReport(data.report)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedImage(null)
    setAnalysisReport(null)
    setError(null)
    setInvalidImageReason(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleLogout = async () => {
    await logout()
    setUserProfile(null)
    setIsAuthenticated(false)
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.push("/dashboard")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push("/profile")} className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold text-balance">Crop Diagnosis</h1>
          <p className="text-muted-foreground text-lg">
            Upload or capture an image of your crop for AI-powered analysis
          </p>
        </div>

        <div className={`grid gap-8 ${analysisReport ? 'grid-cols-1' : 'lg:grid-cols-2'}`}>
          <div className={`space-y-4 ${analysisReport ? 'lg:col-span-1' : ''}`}>
            <Card>
              <CardHeader>
                <CardTitle>Upload Crop Image</CardTitle>
                <CardDescription>Take a clear photo of the affected plant or crop</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!selectedImage ? (
                  <>
                    <div
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:border-green-500 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium mb-2">Click to upload image</p>
                      <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => fileInputRef.current?.click()}
                        className="gap-2"
                      >
                        <Upload className="h-5 w-5" />
                        Upload Image
                      </Button>
                      <Button variant="outline" size="lg" onClick={() => setIsCameraOpen(true)} className="gap-2">
                        <Camera className="h-5 w-5" />
                        Use Camera
                      </Button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </>
                ) : (
                  <>
                    <div className="relative rounded-lg overflow-hidden border">
                      <img src={selectedImage || "/placeholder.svg"} alt="Selected crop" className="w-full h-auto" />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Button onClick={handleAnalyze} disabled={isLoading} size="lg" className="gap-2">
                        {isLoading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-5 w-5" />
                            Analyze Plant
                          </>
                        )}
                      </Button>
                      <Button onClick={handleReset} variant="outline" size="lg" disabled={isLoading}>
                        Choose Different Image
                      </Button>
                    </div>
                  </>
                )}

                {error && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600">
                      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                    {invalidImageReason && (
                      <Card className="border-amber-200 bg-amber-50">
                        <CardHeader>
                          <CardTitle className="text-amber-900 text-base">Why This Image Cannot Be Analyzed</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-amber-700">English:</p>
                            <p className="text-gray-900">{invalidImageReason.english}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-amber-700">
                              {userProfile?.language || "Local Language"}:
                            </p>
                            <p className="text-gray-900 font-medium">{invalidImageReason.local}</p>
                          </div>
                          <div className="mt-4 p-3 bg-white rounded border border-amber-200">
                            <p className="text-sm text-gray-700">
                              <strong>Please upload:</strong> Clear images of plants, crops, leaves, or agricultural
                              subjects only.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {!analysisReport && (
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Analysis Report</CardTitle>
                  <CardDescription>AI-powered diagnosis and treatment recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <Loader2 className="h-12 w-12 animate-spin text-green-600" />
                      <p className="text-muted-foreground">Analyzing your crop image...</p>
                      <p className="text-sm text-muted-foreground">This may take a few moments</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                      <Camera className="h-16 w-16 text-muted-foreground/50" />
                      <div>
                        <p className="text-muted-foreground mb-2">No analysis yet</p>
                        <p className="text-sm text-muted-foreground">Upload an image to get started</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {analysisReport && !isLoading && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <AnalysisReport report={analysisReport} />
          </div>
        )}

        {isLoading && (
          <div className="mt-8">
            <Card>
              <CardContent className="py-12">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-green-600" />
                  <p className="text-muted-foreground">Analyzing your crop image...</p>
                  <p className="text-sm text-muted-foreground">This may take a few moments</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <CameraCapture isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} onCapture={handleCameraCapture} />
    </div>
  )
}
