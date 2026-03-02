"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Printer,
  AlertTriangle,
  Calendar,
  DollarSign,
  MapPin,
  User,
  Package,
  Shield,
  Award,
} from "lucide-react"
import { isAuthenticated, getSession, getUserProfile, getRentalRequestsByFarmer, getRentalRequest, updateRentalRequestStatus } from "@/lib/db"
import { useAppStore } from "@/lib/store"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import QRCode from "qrcode"
import { getSyncedRequestsByFarmer, onSyncChange } from "@/lib/sync"

export default function MyRentalsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { userProfile } = useAppStore()
  const [isLoading, setIsLoading] = useState(true)
  const [rentals, setRentals] = useState<any[]>([])
  const [selectedRental, setSelectedRental] = useState<any>(null)
  const [showCertificate, setShowCertificate] = useState(false)
  const [showDisputeDialog, setShowDisputeDialog] = useState(false)
  const [disputeDetails, setDisputeDetails] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const certificateRef = useRef<HTMLDivElement>(null)
  const [demoPreloaded, setDemoPreloaded] = useState(false) // Hidden demo state
  const [demoRevealed, setDemoRevealed] = useState(false) // Show demo when Z pressed
  const [demoQrCode, setDemoQrCode] = useState("") // Preloaded QR for demo certificate

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        // Check authentication
        const authenticated = await isAuthenticated()
        if (!authenticated) {
          router.push("/auth")
          return
        }

        // Get user email from session
        const session = await getSession()
        const userEmail = session?.userEmail
        
        if (userEmail) {
          const profile = await getUserProfile(userEmail)
          if (profile) {
            await loadRentals(profile.email)
            
            // Preload demo QR code (hidden until Z is pressed)
            try {
              const demoUrl = `${window.location.origin}/rental-status/demo-123`
              const qrUrl = await QRCode.toDataURL(demoUrl)
              setDemoQrCode(qrUrl)
              setDemoPreloaded(true)
            } catch (error) {
              console.error("Failed to preload demo QR:", error)
            }
            
            // Listen for updates from other windows (e.g., provider accepting booking)
            const unsubscribe = onSyncChange(() => {
              if (profile.email) {
                loadRentals(profile.email)
              }
            })
            
            setIsLoading(false)
            return () => unsubscribe()
          }
        }
      } catch (error) {
        console.error("Error loading rentals:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndLoad()
  }, [router])

  // Phase 1: Demo keyboard shortcut - Press 'Z' to force refresh
  useEffect(() => {
    let lastRefresh = 0
    const DEBOUNCE_MS = 1000 // Prevent multiple refreshes within 1 second

    const handleKeyPress = async (e: KeyboardEvent) => {
      // Only trigger on 'z' or 'Z' key
      if (e.key.toLowerCase() !== 'z') return
      
      // Debounce: prevent rapid-fire refreshes
      const now = Date.now()
      if (now - lastRefresh < DEBOUNCE_MS) return
      lastRefresh = now

      // Only work on this page
      if (window.location.pathname !== '/farmer-crm/my-rentals') return

      try {
        console.log('🔑 Z key pressed - revealing demo state...')
        
        // Reveal the preloaded demo state
        if (demoPreloaded && !demoRevealed) {
          setDemoRevealed(true)
          console.log('✅ Demo state revealed - booking confirmed with certificate')
          
          toast({
            title: "✨ Demo Active",
            description: "Your booking has been confirmed! View certificate available.",
            duration: 3000,
          })
        } else {
          // If already revealed, refresh real data
          const session = await getSession()
          const userEmail = session?.userEmail
          
          if (userEmail) {
            await loadRentals(userEmail)
            console.log('✅ Rentals refreshed successfully')
            
            toast({
              title: "Data Refreshed",
              description: "Rental data has been updated.",
              duration: 2000,
            })
          }
        }
      } catch (error) {
        console.error('❌ Failed to process Z key:', error)
      }
    }

    // Add keyboard listener
    window.addEventListener('keydown', handleKeyPress)
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [toast, demoPreloaded, demoRevealed, demoQrCode, userProfile, setShowCertificate, setQrCodeUrl, setSelectedRental])

  const loadRentals = async (email: string) => {
    try {
      // Get requests from IndexedDB
      const dbRequests = await getRentalRequestsByFarmer(email)
      
      // Get requests from localStorage (synced from other windows)
      const syncedRequests = getSyncedRequestsByFarmer(email)
      
      // Merge both sources, prioritizing synced data
      const requestMap = new Map()
      dbRequests.forEach((r: any) => requestMap.set(r.id, r))
      syncedRequests.forEach((r) => requestMap.set(r.id, r))
      
      const allRequests = Array.from(requestMap.values())
      setRentals(allRequests)
    } catch (error) {
      console.error("Failed to load rentals:", error)
    }
  }

  const handleViewCertificate = async (rental: any) => {
    setSelectedRental(rental)
    
    // Generate QR code
    try {
      const url = `${window.location.origin}/rental-status/${rental.id}`
      const qrUrl = await QRCode.toDataURL(url)
      setQrCodeUrl(qrUrl)
    } catch (error) {
      console.error("QR generation failed:", error)
    }
    
    setShowCertificate(true)
  }

  const handlePrintCertificate = () => {
    window.print()
  }

  const handleReportProblem = (rental: any) => {
    setSelectedRental(rental)
    setShowDisputeDialog(true)
  }

  const handleSubmitDispute = async () => {
    if (!selectedRental || !disputeDetails.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please describe the issue",
        variant: "destructive",
      })
      return
    }

    try {
      await updateRentalRequestStatus(selectedRental.id, selectedRental.status, {
        disputeReported: true,
        disputeDetails,
      })

      toast({
        title: "Problem Reported",
        description: "The provider has been notified. Our support team will contact you soon.",
      })

      setShowDisputeDialog(false)
      setDisputeDetails("")
      
      if (userProfile?.email) {
        await loadRentals(userProfile.email)
      }
    } catch (error) {
      console.error("Failed to report dispute:", error)
      toast({
        title: "Error",
        description: "Failed to report the problem. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "confirmed":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      case "completed":
        return "bg-blue-500"
      case "cancelled":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle2 className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filterRentalsByStatus = (status: string[]) => {
    return rentals.filter((r) => status.includes(r.status))
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/farmer-crm")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Listings
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-6">My Rentals</h1>

          <Tabs defaultValue="active" className="space-y-6">
            <TabsList>
              <TabsTrigger value="active">Active Bookings</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">History</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {/* Demo: Show confirmed booking when revealed */}
              {demoRevealed && (
                <Card className="border-2 border-green-500 bg-green-50/30">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">Premium Tractor 5000</h3>
                          <p className="text-sm text-muted-foreground">
                            Provider: <span className="font-medium">Demo Provider Services</span>
                          </p>
                        </div>
                        <Badge className="bg-green-500 hover:bg-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="ml-1">Confirmed</span>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Start Date
                          </p>
                          <p className="font-medium">{new Date().toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            End Date
                          </p>
                          <p className="font-medium">{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Duration
                          </p>
                          <p className="font-medium">7 days</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            Total
                          </p>
                          <p className="font-medium text-green-600">₹8,750</p>
                        </div>
                      </div>

                      <div className="bg-green-100 border border-green-200 rounded-md p-3 flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-green-800">Booking Confirmed!</p>
                          <p className="text-xs text-green-700 mt-1">Your rental agreement certificate is ready</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setSelectedRental({
                              id: 'demo-123',
                              machineryName: 'Premium Tractor 5000',
                              providerName: 'Demo Provider Services',
                              farmerName: (userProfile as any)?.name || 'Demo Farmer',
                              startDate: new Date().toISOString(),
                              endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                              totalDays: 7,
                              totalPrice: 8750,
                              agreementId: 'KS-DEMO-' + new Date().toISOString().split('T')[0] + '-ABCD1234',
                              status: 'confirmed',
                            })
                            setQrCodeUrl(demoQrCode)
                            setShowCertificate(true)
                          }}
                          className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                        >
                          <FileText className="h-4 w-4" />
                          View Agreement Certificate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Show real rentals */}
              {filterRentalsByStatus(["confirmed"]).length === 0 && !demoRevealed ? (
                <Card className="p-12">
                  <div className="text-center space-y-2">
                    <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="text-lg font-semibold">No active bookings</h3>
                    <p className="text-muted-foreground">Your confirmed rentals will appear here</p>
                  </div>
                </Card>
              ) : null}
              
              {filterRentalsByStatus(["confirmed"]).map((rental) => (
                  <Card key={rental.id} className="border-2 border-green-200">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{rental.machineryName}</h3>
                            <p className="text-sm text-muted-foreground">
                              Provider: <span className="font-medium">{rental.providerName}</span>
                            </p>
                          </div>
                          <Badge className={getStatusColor(rental.status)}>
                            {getStatusIcon(rental.status)}
                            <span className="ml-1 capitalize">{rental.status}</span>
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Start Date
                            </p>
                            <p className="font-medium">{new Date(rental.startDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              End Date
                            </p>
                            <p className="font-medium">{new Date(rental.endDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Duration
                            </p>
                            <p className="font-medium">{rental.totalDays} days</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              Rental Total
                            </p>
                            <p className="font-medium text-green-600">₹{rental.totalPrice}</p>
                          </div>
                        </div>

                        {/* Fuel Payment Details */}
                        {rental.fuelIncluded && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                              <div className="bg-orange-500 text-white rounded-full p-1">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-orange-900">Fuel Payment Agreement</p>
                                <div className="grid grid-cols-2 gap-2 text-xs mt-1">
                                  <div>
                                    <span className="text-muted-foreground">Paid By:</span>
                                    <span className="ml-1 font-medium capitalize">
                                      {rental.fuelPaidBy === "farmer" ? "🧑‍🌾 You (Farmer)" : 
                                       rental.fuelPaidBy === "provider" ? "🚜 Provider" : 
                                       "🤝 Shared 50-50"}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Est. Cost:</span>
                                    <span className="ml-1 font-medium text-orange-700">
                                      ₹{rental.estimatedFuelCost || 0}
                                      {rental.fuelPaidBy === "shared" && ` (₹${Math.round((rental.estimatedFuelCost || 0) / 2)} each)`}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {rental.disputeReported && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-yellow-800">Problem Reported</p>
                              <p className="text-xs text-yellow-700 mt-1">Our support team is reviewing your issue</p>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleViewCertificate(rental)}
                            variant="outline"
                            className="flex-1 gap-2"
                          >
                            <FileText className="h-4 w-4" />
                            View Agreement
                          </Button>
                          {!rental.disputeReported && (
                            <Button
                              onClick={() => handleReportProblem(rental)}
                              variant="outline"
                              className="gap-2"
                            >
                              <AlertTriangle className="h-4 w-4" />
                              Report Issue
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {filterRentalsByStatus(["pending"]).length === 0 ? (
                <Card className="p-12">
                  <div className="text-center space-y-2">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="text-lg font-semibold">No pending requests</h3>
                    <p className="text-muted-foreground">Your pending booking requests will appear here</p>
                  </div>
                </Card>
              ) : (
                filterRentalsByStatus(["pending"]).map((rental) => (
                  <Card key={rental.id}>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{rental.machineryName}</h3>
                            <p className="text-sm text-muted-foreground">
                              Provider: <span className="font-medium">{rental.providerName}</span>
                            </p>
                          </div>
                          <Badge className={getStatusColor(rental.status)}>
                            {getStatusIcon(rental.status)}
                            <span className="ml-1 capitalize">{rental.status}</span>
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Start Date</p>
                            <p className="font-medium">{new Date(rental.startDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">End Date</p>
                            <p className="font-medium">{new Date(rental.endDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Duration</p>
                            <p className="font-medium">{rental.totalDays} days</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Rental Total</p>
                            <p className="font-medium text-green-600">₹{rental.totalPrice}</p>
                          </div>
                        </div>

                        {/* Fuel Payment Details */}
                        {rental.fuelIncluded && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                              <div className="bg-orange-500 text-white rounded-full p-1">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-orange-900">Fuel Payment Agreement</p>
                                <div className="text-xs mt-1">
                                  <span className="text-muted-foreground">Paid By:</span>
                                  <span className="ml-1 font-medium capitalize">
                                    {rental.fuelPaidBy === "farmer" ? "🧑‍🌾 You" : 
                                     rental.fuelPaidBy === "provider" ? "🚜 Provider" : 
                                     "🤝 Shared"}
                                  </span>
                                  <span className="mx-2">•</span>
                                  <span className="text-muted-foreground">Est.:</span>
                                  <span className="ml-1 font-medium text-orange-700">₹{rental.estimatedFuelCost || 0}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <p className="text-sm text-muted-foreground">
                          Waiting for provider approval...
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {filterRentalsByStatus(["completed", "rejected", "cancelled"]).length === 0 ? (
                <Card className="p-12">
                  <div className="text-center space-y-2">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="text-lg font-semibold">No history yet</h3>
                    <p className="text-muted-foreground">Your past rentals will appear here</p>
                  </div>
                </Card>
              ) : (
                filterRentalsByStatus(["completed", "rejected", "cancelled"]).map((rental) => (
                  <Card key={rental.id}>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{rental.machineryName}</h3>
                            <p className="text-sm text-muted-foreground">
                              Provider: <span className="font-medium">{rental.providerName}</span>
                            </p>
                          </div>
                          <Badge className={getStatusColor(rental.status)}>
                            {getStatusIcon(rental.status)}
                            <span className="ml-1 capitalize">{rental.status}</span>
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Start Date</p>
                            <p className="font-medium">{new Date(rental.startDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">End Date</p>
                            <p className="font-medium">{new Date(rental.endDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Duration</p>
                            <p className="font-medium">{rental.totalDays} days</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Total</p>
                            <p className="font-medium">₹{rental.totalPrice}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      {/* Certificate Dialog */}
      <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
        <DialogContent className="max-w-[95vw] md:max-w-[80vw] min-w-[800px] max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Verifiable Rental Agreement Certificate</DialogTitle>
          </DialogHeader>
          <div ref={certificateRef} className="certificate-print bg-white w-full">
            {/* Decorative Border */}
            <div className="certificate-border p-8">
              {/* Header Section */}
              <div className="text-center mb-8 pb-6 border-b-4 border-double border-green-700">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-full flex items-center justify-center">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      KisanSaathi
                    </h1>
                    <p className="text-sm text-muted-foreground tracking-wider">DIGITAL AGRICULTURE PLATFORM</p>
                  </div>
                </div>
                <div className="mt-4">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">MACHINERY RENTAL AGREEMENT</h2>
                  <p className="text-sm text-muted-foreground">Digitally Signed & Verifiable Certificate</p>
                </div>
              </div>

            {selectedRental && (
              <>
                {/* Agreement ID Badge */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 p-6 rounded-lg text-center mb-8 shadow-sm">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Certificate Reference Number</p>
                  <p className="text-2xl font-mono font-bold text-green-700 tracking-wide">{selectedRental.agreementId || selectedRental.id}</p>
                  <p className="text-xs text-muted-foreground mt-2">This unique ID can be used to verify this agreement</p>
                </div>

                {/* Party Details Section */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Farmer Details */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-green-600">
                      <User className="h-5 w-5 text-green-600" />
                      <h3 className="font-bold text-lg text-gray-800">PARTY A - RENTER</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Full Name</p>
                        <p className="font-semibold text-gray-800">{selectedRental.farmerName}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Email Address</p>
                        <p className="font-medium text-gray-700 text-sm">{selectedRental.farmerEmail}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Contact Number</p>
                        <p className="font-medium text-gray-700">{selectedRental.farmerPhone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Provider Details */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-blue-600">
                      <Package className="h-5 w-5 text-blue-600" />
                      <h3 className="font-bold text-lg text-gray-800">PARTY B - PROVIDER</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Business Name</p>
                        <p className="font-semibold text-gray-800">{selectedRental.providerName}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Email Address</p>
                        <p className="font-medium text-gray-700 text-sm">{selectedRental.providerEmail}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Status</p>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <p className="font-medium text-green-700 text-sm">Verified Provider</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Equipment & Rental Details */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded-lg p-6 mb-8 shadow-md">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-gray-400">
                    <MapPin className="h-5 w-5 text-gray-700" />
                    <h3 className="font-bold text-lg text-gray-800">RENTAL AGREEMENT DETAILS</h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Equipment Description</p>
                        <p className="font-bold text-xl text-gray-900">{selectedRental.machineryName}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Commencement Date</p>
                          <p className="font-semibold text-gray-800">{new Date(selectedRental.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Termination Date</p>
                          <p className="font-semibold text-gray-800">{new Date(selectedRental.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Total Rental Period</p>
                        <p className="font-semibold text-gray-800">{selectedRental.totalDays} Calendar Days</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 rounded-lg p-6 flex flex-col items-center justify-center shadow-sm">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Total Rental Amount</p>
                      <p className="font-bold text-4xl text-green-700 mb-1">₹{selectedRental.totalPrice}</p>
                      <p className="text-xs text-muted-foreground">Payment: Cash on Delivery</p>
                    </div>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <h3 className="font-bold text-lg text-gray-800">TERMS & CONDITIONS OF RENTAL</h3>
                  </div>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">1</div>
                      <p><strong>Payment Terms:</strong> The Renter agrees to pay the total rental amount of ₹{selectedRental.totalPrice} in cash on delivery of the equipment. No advance payment is required.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">2</div>
                      <p><strong>Equipment Condition:</strong> The Renter acknowledges receiving the equipment in good working condition and agrees to return it in the same condition, subject to normal wear and tear.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">3</div>
                      <p><strong>Liability & Insurance:</strong> The Renter assumes full responsibility for the equipment during the rental period and shall be liable for any loss, damage, or theft occurring during this time.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">4</div>
                      <p><strong>Dispute Resolution:</strong> Any disputes arising from this agreement shall be resolved through the KisanSaathi platform's resolution mechanism.</p>
                    </div>
                  </div>
                </div>

                {/* Digital Signatures Section */}
                <div className="border-2 border-gray-300 rounded-lg p-6 mb-6 bg-white">
                  <div className="flex items-center gap-2 mb-6 pb-3 border-b-2 border-gray-300">
                    <Award className="h-5 w-5 text-amber-600" />
                    <h3 className="font-bold text-lg text-gray-800">DIGITAL AUTHENTICATION</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="border-l-4 border-green-600 pl-4 bg-green-50 py-4 pr-4 rounded">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-gray-800 mb-1">Party A - Renter Confirmation</p>
                          <p className="font-semibold text-green-700">{selectedRental.farmerName}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Digitally confirmed on:<br />
                            {new Date(selectedRental.farmerConfirmedAt).toLocaleString('en-IN', { 
                              dateStyle: 'full', 
                              timeStyle: 'short' 
                            })}
                          </p>
                          <div className="mt-3 pt-3 border-t border-green-300">
                            <p className="text-xs italic text-gray-600">Electronic Signature Applied</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {selectedRental.providerConfirmedAt && (
                      <div className="border-l-4 border-blue-600 pl-4 bg-blue-50 py-4 pr-4 rounded">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                          <div>
                            <p className="font-bold text-gray-800 mb-1">Party B - Provider Confirmation</p>
                            <p className="font-semibold text-blue-700">{selectedRental.providerName}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Digitally confirmed on:<br />
                              {new Date(selectedRental.providerConfirmedAt).toLocaleString('en-IN', { 
                                dateStyle: 'full', 
                                timeStyle: 'short' 
                              })}
                            </p>
                            <div className="mt-3 pt-3 border-t border-blue-300">
                              <p className="text-xs italic text-gray-600">Electronic Signature Applied</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 pt-6 border-t-2 border-dashed border-gray-300 bg-amber-50 p-4 rounded">
                    <p className="text-xs text-center text-gray-700">
                      <Shield className="h-4 w-4 inline mr-1" />
                      This agreement is legally binding and has been digitally signed by both parties using the KisanSaathi secure authentication system.
                    </p>
                  </div>
                </div>

                {/* QR Code Verification */}
                {qrCodeUrl && (
                  <div className="flex justify-between items-center border-2 border-gray-300 rounded-lg p-6 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-2">Instant Verification</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Scan this QR code with your smartphone to instantly verify the authenticity and status of this rental agreement.
                      </p>
                      <div className="flex items-center gap-2 text-xs text-green-700">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="font-medium">Blockchain-Secured • Tamper-Proof</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="bg-white p-3 rounded-lg shadow-md border-2 border-gray-200">
                        <img src={qrCodeUrl} alt="Verification QR Code" width={120} height={120} />
                      </div>
                      <p className="text-xs text-muted-foreground">Scan to Verify</p>
                    </div>
                  </div>
                )}

                {/* Certificate Footer */}
                <div className="mt-8 pt-6 border-t-4 border-double border-gray-400 text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-8 h-1 bg-gradient-to-r from-transparent via-green-600 to-transparent"></div>
                    <FileText className="h-5 w-5 text-green-600" />
                    <div className="w-8 h-1 bg-gradient-to-r from-transparent via-green-600 to-transparent"></div>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    This is a digitally generated certificate from KisanSaathi Digital Agriculture Platform
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Certificate Generated: {new Date().toLocaleString('en-IN', { 
                      dateStyle: 'full', 
                      timeStyle: 'medium' 
                    })}
                  </p>
                  <div className="text-xs text-muted-foreground space-y-1 pt-3">
                    <p>KisanSaathi™ - Empowering Indian Agriculture</p>
                    <p className="font-mono">Document ID: {selectedRental.agreementId || selectedRental.id}</p>
                  </div>
                </div>
              </>
            )}
            </div>
          </div>
          <div className="flex gap-3 p-6 border-t bg-gray-50">
            <Button onClick={handlePrintCertificate} className="flex-1 gap-2 bg-green-600 hover:bg-green-700 h-12 text-base">
              <Printer className="h-5 w-5" />
              Print Certificate
            </Button>
            <Button variant="outline" onClick={() => setShowCertificate(false)} className="h-12 px-8">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dispute Dialog */}
      <Dialog open={showDisputeDialog} onOpenChange={setShowDisputeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report a Problem</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dispute">Describe the issue</Label>
              <Textarea
                id="dispute"
                placeholder="Please provide details about the problem you're experiencing..."
                value={disputeDetails}
                onChange={(e) => setDisputeDetails(e.target.value)}
                rows={5}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmitDispute} className="flex-1">
                Submit Report
              </Button>
              <Button variant="outline" onClick={() => setShowDisputeDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style dangerouslySetInnerHTML={{
        __html: `
          /* Certificate Border Styling */
          .certificate-border {
            border: 8px double #059669;
            border-radius: 8px;
            position: relative;
            background: linear-gradient(to bottom, #ffffff, #f9fafb);
          }
          
          .certificate-border::before {
            content: '';
            position: absolute;
            top: 12px;
            left: 12px;
            right: 12px;
            bottom: 12px;
            border: 2px solid #10b981;
            border-radius: 4px;
            pointer-events: none;
          }
          
          /* Print Styles */
          @media print {
            /* Hide everything except certificate */
            body * {
              visibility: hidden;
            }
            
            .certificate-print,
            .certificate-print * {
              visibility: visible;
            }
            
            .certificate-print {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 0;
              margin: 0;
              background: white !important;
            }
            
            /* Optimize for A4 printing */
            @page {
              size: A4;
              margin: 15mm;
            }
            
            /* Ensure colors print */
            .certificate-border {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            
            /* Better spacing for print */
            .certificate-border {
              padding: 20mm;
              page-break-inside: avoid;
            }
            
            /* Hide dialog buttons when printing */
            button {
              display: none !important;
            }
            
            /* Ensure QR code prints */
            img {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            
            /* Fix gradients for print */
            .bg-gradient-to-r,
            .bg-gradient-to-br,
            .bg-gradient-to-l {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
          
          /* Screen-only styles for better preview */
          @media screen {
            .certificate-print {
              box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
              width: 100%;
              max-width: 100%;
              margin: 0 auto;
            }
          }
        `
      }} />
    </div>
  )
}
