"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ArrowLeft,
  Loader2,
  Plus,
  DollarSign,
  Package,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
} from "lucide-react"
import { isAuthenticated, getSession, getUserProfile, getMachineryByProvider, getRentalRequestsByProvider, updateRentalRequestStatus } from "@/lib/db"
import { useAppStore } from "@/lib/store"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { getSyncedRequestsByProvider, syncRentalRequest, onSyncChange } from "@/lib/sync"

export default function ProviderCRMPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { userProfile, setUserProfile, setIsAuthenticated } = useAppStore()
  const [isLoading, setIsLoading] = useState(true)
  const [myMachinery, setMyMachinery] = useState<any[]>([])
  const [incomingRequests, setIncomingRequests] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("requests")
  const [demoPreloaded, setDemoPreloaded] = useState(false) // Hidden demo state
  const [demoRevealed, setDemoRevealed] = useState(false) // Show demo when Z pressed
  const [showDemoRequestDialog, setShowDemoRequestDialog] = useState(false) // Show request acceptance dialog
  const [demoAccepted, setDemoAccepted] = useState(false) // Track if demo request was accepted

  useEffect(() => {
    const checkAuth = async () => {
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
            setUserProfile(profile)
            setIsAuthenticated(true)
            
            // Check if user is a provider
            if (profile.role !== "Service Provider") {
              router.push("/dashboard")
              return
            }

            // Load provider data
            await loadProviderData(profile.email)
            
            // Preload demo state (hidden until Z is pressed)
            setDemoPreloaded(true)
            
            // Listen for new requests from other windows
            const unsubscribe = onSyncChange(() => {
              if (profile.email) {
                loadProviderData(profile.email)
              }
            })
            
            setIsLoading(false)
            return () => unsubscribe()
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/auth")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, setUserProfile, setIsAuthenticated])

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
      if (window.location.pathname !== '/provider-crm') return

      try {
        console.log('🔑 Z key pressed - revealing demo state...')
        
        // Show demo request dialog first
        if (demoPreloaded && !demoRevealed) {
          setShowDemoRequestDialog(true)
          console.log('✅ Demo request dialog triggered')
          
          toast({
            title: "✨ Demo Active",
            description: "New booking request received!",
            duration: 2000,
          })
        } else {
          // If already revealed, refresh real data
          const session = await getSession()
          const userEmail = session?.userEmail
          
          if (userEmail) {
            await loadProviderData(userEmail)
            console.log('✅ Provider data refreshed successfully')
            
            toast({
              title: "Data Refreshed",
              description: "Incoming requests have been updated.",
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
  }, [toast, demoPreloaded, demoRevealed, userProfile, setShowDemoRequestDialog, demoAccepted, setDemoAccepted])

  const loadProviderData = async (email: string) => {
    try {
      const machinery = await getMachineryByProvider(email)
      setMyMachinery(machinery)

      // Get requests from IndexedDB
      const dbRequests = await getRentalRequestsByProvider(email)
      
      // Get requests from localStorage (synced from other windows)
      const syncedRequests = getSyncedRequestsByProvider(email)
      
      // Merge both sources, prioritizing synced data
      const requestMap = new Map()
      dbRequests.forEach((r: any) => requestMap.set(r.id, r))
      syncedRequests.forEach((r) => requestMap.set(r.id, r))
      
      const allRequests = Array.from(requestMap.values())
      
      // Filter only pending requests for the Incoming tab
      const pending = allRequests.filter((r: any) => r.status === "pending")
      setIncomingRequests(pending)
    } catch (error) {
      console.error("Failed to load provider data:", error)
    }
  }

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const agreementId = `KS-RENTAL-${new Date().toISOString().split("T")[0]}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      
      const updatedData = {
        providerConfirmedAt: new Date().toISOString(),
        agreementId,
      }
      
      await updateRentalRequestStatus(requestId, "confirmed", updatedData)
      
      // Sync the updated request to localStorage
      const syncedRequests = getSyncedRequestsByProvider(userProfile?.email || "")
      const request = syncedRequests.find((r) => r.id === requestId)
      if (request) {
        syncRentalRequest({
          ...request,
          status: "confirmed",
          ...updatedData,
          updatedAt: new Date().toISOString(),
        })
      }

      // Refresh data
      if (userProfile?.email) {
        await loadProviderData(userProfile.email)
      }

      toast({
        title: "Booking Confirmed",
        description: "The rental request has been accepted successfully.",
      })
    } catch (error) {
      console.error("Failed to accept request:", error)
      toast({
        title: "Error",
        description: "Failed to accept the request. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    try {
      await updateRentalRequestStatus(requestId, "rejected")

      // Refresh data
      if (userProfile?.email) {
        await loadProviderData(userProfile.email)
      }

      toast({
        title: "Booking Rejected",
        description: "The rental request has been declined.",
      })
    } catch (error) {
      console.error("Failed to reject request:", error)
      toast({
        title: "Error",
        description: "Failed to reject the request. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAcceptDemoRequest = () => {
    // Close dialog and show accepted state
    setShowDemoRequestDialog(false)
    setDemoAccepted(true)
    setDemoRevealed(true)
    
    console.log('✅ Demo request accepted')
    
    toast({
      title: "Booking Confirmed",
      description: "The rental request has been accepted successfully.",
      duration: 2000,
    })
  }

  const handleRejectDemoRequest = () => {
    // Close dialog only
    setShowDemoRequestDialog(false)
    
    console.log('❌ Demo request rejected')
    
    toast({
      title: "Booking Rejected",
      description: "The rental request has been declined.",
      duration: 2000,
    })
  }

  const calculateEarnings = () => {
    // This would calculate based on completed rentals
    return {
      total: 0,
      thisMonth: 0,
      completedJobs: 0,
    }
  }

  const earnings = calculateEarnings()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-blue-600">Provider Panel</h1>
                <p className="text-sm text-muted-foreground">Manage your machinery and bookings</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="requests">
                <Clock className="h-4 w-4 mr-2" />
                Incoming Requests
                {incomingRequests.length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {incomingRequests.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="machinery">
                <Package className="h-4 w-4 mr-2" />
                My Machinery
              </TabsTrigger>
              <TabsTrigger value="earnings">
                <DollarSign className="h-4 w-4 mr-2" />
                Earnings
              </TabsTrigger>
            </TabsList>

            {/* Incoming Requests Tab */}
            <TabsContent value="requests" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Booking Requests</CardTitle>
                  <CardDescription>
                    Review and respond to rental requests from farmers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Demo: Show accepted booking when revealed */}
                  {demoRevealed && demoAccepted && (
                    <Card className="border-2 border-green-500 bg-green-50/50 mb-4">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">Premium Tractor 5000</h3>
                              <p className="text-sm text-muted-foreground">
                                Requested by: <span className="font-medium">Demo Farmer</span>
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Contact: +91 98765 43210
                              </p>
                            </div>
                            <Badge className="bg-green-500 hover:bg-green-600">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Accepted
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Start Date</p>
                              <p className="font-medium">{new Date().toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">End Date</p>
                              <p className="font-medium">{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Duration</p>
                              <p className="font-medium">7 days</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Total Amount</p>
                              <p className="font-medium text-green-600">₹8,750</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 p-3 bg-green-100 rounded-lg">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium text-green-900">Booking Confirmed!</p>
                              <p className="text-sm text-green-700">The farmer will receive their rental certificate.</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {incomingRequests.length === 0 && !demoRevealed ? (
                    <div className="text-center py-12 space-y-2">
                      <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="text-lg font-semibold">No pending requests</h3>
                      <p className="text-muted-foreground">
                        New booking requests will appear here
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {incomingRequests.map((request) => (
                        <Card key={request.id} className="border-2">
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold text-lg">{request.machineryName}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    Requested by: <span className="font-medium">{request.farmerName}</span>
                                  </p>
                                  {request.farmerPhone && (
                                    <p className="text-sm text-muted-foreground">
                                      Contact: {request.farmerPhone}
                                    </p>
                                  )}
                                </div>
                                <Badge variant="outline">Pending</Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Start Date</p>
                                  <p className="font-medium">{new Date(request.startDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">End Date</p>
                                  <p className="font-medium">{new Date(request.endDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Duration</p>
                                  <p className="font-medium">{request.totalDays} days</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Rental Amount</p>
                                  <p className="font-medium text-green-600">₹{request.totalPrice}</p>
                                </div>
                              </div>

                              {/* Fuel Payment Details */}
                              {request.fuelIncluded && (
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                                  <div className="flex items-start gap-2">
                                    <div className="bg-orange-500 text-white rounded-full p-1">
                                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                      </svg>
                                    </div>
                                    <div className="flex-1 space-y-1">
                                      <p className="text-sm font-semibold text-orange-900">Fuel Payment Included</p>
                                      <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                          <span className="text-muted-foreground">Paid By:</span>
                                          <span className="ml-1 font-medium capitalize">
                                            {request.fuelPaidBy === "farmer" ? "🧑‍🌾 Farmer" : 
                                             request.fuelPaidBy === "provider" ? "🚜 You (Provider)" : 
                                             "🤝 Shared 50-50"}
                                          </span>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">Est. Cost:</span>
                                          <span className="ml-1 font-medium text-orange-700">
                                            ₹{request.estimatedFuelCost || 0}
                                            {request.fuelPaidBy === "shared" && ` (₹${Math.round((request.estimatedFuelCost || 0) / 2)} each)`}
                                          </span>
                                        </div>
                                      </div>
                                      {request.fuelPaidBy === "provider" && (
                                        <p className="text-xs text-orange-700 font-medium mt-1">
                                          ⚠️ You will be responsible for fuel costs
                                        </p>
                                      )}
                                      {request.fuelPaidBy === "shared" && (
                                        <p className="text-xs text-orange-700 font-medium mt-1">
                                          💡 Split fuel cost with farmer
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleAcceptRequest(request.id)}
                                  className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Accept Booking
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleRejectRequest(request.id)}
                                  className="flex-1"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Decline
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* My Machinery Tab */}
            <TabsContent value="machinery" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>My Machinery Listings</CardTitle>
                      <CardDescription>
                        Manage your equipment available for rent
                      </CardDescription>
                    </div>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add New Machinery
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {myMachinery.length === 0 ? (
                    <div className="text-center py-12 space-y-2">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="text-lg font-semibold">No machinery listed</h3>
                      <p className="text-muted-foreground">
                        Add your first machinery to start receiving bookings
                      </p>
                      <Button className="mt-4 gap-2">
                        <Plus className="h-4 w-4" />
                        Add Machinery
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Machine Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price/Day</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {myMachinery.map((machine) => (
                          <TableRow key={machine.id}>
                            <TableCell className="font-medium">{machine.name}</TableCell>
                            <TableCell>{machine.category}</TableCell>
                            <TableCell>₹{machine.pricePerDay}</TableCell>
                            <TableCell>
                              <Badge
                                variant={machine.status === "available" ? "default" : "secondary"}
                                className={
                                  machine.status === "available"
                                    ? "bg-green-500 hover:bg-green-600"
                                    : ""
                                }
                              >
                                {machine.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Earnings Tab */}
            <TabsContent value="earnings" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">₹{earnings.total}</div>
                    <p className="text-xs text-muted-foreground mt-1">All time</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">₹{earnings.thisMonth}</div>
                    <p className="text-xs text-muted-foreground mt-1">Current month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">{earnings.completedJobs}</div>
                    <p className="text-xs text-muted-foreground mt-1">Total bookings</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Earnings Overview</CardTitle>
                  <CardDescription>
                    Track your rental income and performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 space-y-2">
                    <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="text-lg font-semibold">No earnings yet</h3>
                    <p className="text-muted-foreground">
                      Start accepting bookings to see your earnings here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      {/* Demo Request Acceptance Dialog */}
      <Dialog open={showDemoRequestDialog} onOpenChange={setShowDemoRequestDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              New Booking Request
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Premium Tractor 5000</h3>
                      <p className="text-sm text-muted-foreground">
                        Requested by: <span className="font-medium">Demo Farmer</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Contact: +91 98765 43210
                      </p>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Start Date</p>
                      <p className="font-medium">{new Date().toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">End Date</p>
                      <p className="font-medium">{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-medium">7 days</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Amount</p>
                      <p className="font-medium text-green-600">₹8,750</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleAcceptDemoRequest}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Accept Booking
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleRejectDemoRequest}
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Decline
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
