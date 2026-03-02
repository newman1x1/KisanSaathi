"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, Sprout, ArrowLeft } from "lucide-react"
import { saveUserProfile, saveSession, userExists } from "@/lib/db"
import { getOTPExpiry } from "@/lib/otp"
import emailjs from "@emailjs/browser"

const SOIL_TYPES = ["Alluvial", "Black", "Red", "Laterite", "Desert", "Mountain"]
const LANGUAGES = ["English", "Hindi", "Punjabi", "Marathi", "Telugu"]

export default function AuthPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showOTPInput, setShowOTPInput] = useState(false)
  const [otpValue, setOtpValue] = useState("")
  const [generatedOTP, setGeneratedOTP] = useState("")
  const [error, setError] = useState("")

  // Sign up form state
  const [signupData, setSignupData] = useState({
    email: "",
    username: "",
    country: "",
    state: "",
    address: "",
    soilType: "",
    language: "",
    role: "Farmer" as "Farmer" | "Service Provider",
  })

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")

  const sendOTPEmail = async (email: string): Promise<{ success: boolean; otp?: string; error?: string }> => {
    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

      if (!serviceId || !templateId || !publicKey) {
        console.log("[v0] Email.js configuration missing")
        return { success: false, error: "Email service not configured" }
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString()

      const templateParams = {
        to_email: email,
        otp_code: otp,
        user_email: email,
      }

      await emailjs.send(serviceId, templateId, templateParams, publicKey)

      return { success: true, otp }
    } catch (error) {
      console.error("[v0] EmailJS error:", error)
      return { success: false, error: "Failed to send OTP email" }
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await sendOTPEmail(signupData.email)

      if (!result.success) {
        throw new Error(result.error || "Failed to send OTP")
      }

      const otp = result.otp || "000000"
      setGeneratedOTP(otp)

      await saveSession({
        userEmail: signupData.email,
        otp: otp,
        expires: getOTPExpiry(),
        isAuthenticated: false,
      })

      setShowOTPInput(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const exists = await userExists(loginEmail)
      if (!exists) {
        throw new Error("No account found with this email. Please sign up first.")
      }

      const result = await sendOTPEmail(loginEmail)

      if (!result.success) {
        throw new Error(result.error || "Failed to send OTP")
      }

      const otp = result.otp || "000000"
      setGeneratedOTP(otp)

      await saveSession({
        userEmail: loginEmail,
        otp: otp,
        expires: getOTPExpiry(),
        isAuthenticated: false,
      })

      setShowOTPInput(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPVerify = async () => {
    setError("")
    setIsLoading(true)

    try {
      if (otpValue !== generatedOTP) {
        throw new Error("Invalid OTP. Please try again.")
      }

      if (signupData.email) {
        await saveUserProfile(signupData)
      }

      const userEmail = signupData.email || loginEmail
      const sessionExpiry = getOTPExpiry()

      await saveSession({
        userEmail: userEmail,
        otp: generatedOTP,
        expires: sessionExpiry,
        isAuthenticated: true,
      })

      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP verification failed")
    } finally {
      setIsLoading(false)
    }
  }

  if (showOTPInput) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Sprout className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Verify OTP</CardTitle>
            <CardDescription>We've sent a 6-digit code to your email. Enter it below to continue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">{error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                maxLength={6}
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ""))}
                className="text-center text-2xl tracking-widest"
              />
            </div>
            <Button onClick={handleOTPVerify} disabled={isLoading || otpValue.length !== 6} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Continue"
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setShowOTPInput(false)
                setOtpValue("")
                setError("")
              }}
              className="w-full"
            >
              Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <div className="w-full max-w-2xl">
        {/* Back to Landing Button */}
        <div className="mb-4 sm:mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="gap-2 text-green-700 hover:text-green-800 hover:bg-green-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center px-4 sm:px-6">
            <div className="mx-auto mb-4 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-green-100">
              <Sprout className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-balance">Welcome to KisanSaathi</CardTitle>
            <CardDescription className="text-sm sm:text-base">Your AI-powered farming companion</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <Tabs defaultValue="signup" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signup" className="text-sm sm:text-base">Sign Up</TabsTrigger>
                <TabsTrigger value="login" className="text-sm sm:text-base">Login</TabsTrigger>
              </TabsList>

              <TabsContent value="signup" className="space-y-4 mt-6">
                {error && (
                  <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">{error}</div>
                )}
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="farmer@example.com"
                        required
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username *</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Your name"
                        required
                        value={signupData.username}
                        onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        type="text"
                        placeholder="India"
                        required
                        value={signupData.country}
                        onChange={(e) => setSignupData({ ...signupData, country: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        type="text"
                        placeholder="Punjab"
                        required
                        value={signupData.state}
                        onChange={(e) => setSignupData({ ...signupData, state: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your farm address"
                      required
                      value={signupData.address}
                      onChange={(e) => setSignupData({ ...signupData, address: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="soilType">Soil Type *</Label>
                      <Select
                        value={signupData.soilType}
                        onValueChange={(value) => setSignupData({ ...signupData, soilType: value })}
                        required
                      >
                        <SelectTrigger id="soilType">
                          <SelectValue placeholder="Select soil type" />
                        </SelectTrigger>
                        <SelectContent>
                          {SOIL_TYPES.map((soil) => (
                            <SelectItem key={soil} value={soil}>
                              {soil}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Preferred Language *</Label>
                      <Select
                        value={signupData.language}
                        onValueChange={(value) => setSignupData({ ...signupData, language: value })}
                        required
                      >
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGES.map((lang) => (
                            <SelectItem key={lang} value={lang}>
                              {lang}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>I am a *</Label>
                    <RadioGroup
                      value={signupData.role}
                      onValueChange={(value) => setSignupData({ ...signupData, role: value as "Farmer" | "Service Provider" })}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Farmer" id="farmer" />
                        <Label htmlFor="farmer" className="font-normal cursor-pointer">Farmer</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Service Provider" id="provider" />
                        <Label htmlFor="provider" className="font-normal cursor-pointer">Service Provider</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="login" className="space-y-4 mt-6">
                {error && (
                  <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">{error}</div>
                )}
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="farmer@example.com"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
