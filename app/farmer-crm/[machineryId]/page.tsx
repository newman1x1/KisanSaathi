"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Loader2,
  MapPin,
  Star,
  Phone,
  Shield,
  CheckCircle2,
  Calendar as CalendarIcon,
  User,
  Package,
} from "lucide-react"
import { isAuthenticated, getSession, getUserProfile, getMachinery, saveRentalRequest } from "@/lib/db"
import { syncRentalRequest } from "@/lib/sync"
import { useAppStore } from "@/lib/store"
import { motion } from "framer-motion"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { DateRange } from "react-day-picker"

export default function MachineryDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const { userProfile } = useAppStore()
  const [isLoading, setIsLoading] = useState(true)
  const [machinery, setMachinery] = useState<any>(null)
  const [showBookingDialog, setShowBookingDialog] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [isBooking, setIsBooking] = useState(false)
  const [fuelIncluded, setFuelIncluded] = useState(false)
  const [fuelPaidBy, setFuelPaidBy] = useState<"farmer" | "provider" | "shared">("farmer")

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        // Check authentication
        const authenticated = await isAuthenticated()
        if (!authenticated) {
          router.push("/auth")
          return
        }

        const machineryId = params.machineryId as string
        if (machineryId) {
          const data = await getMachinery(machineryId)
          if (data) {
            setMachinery(data)
          } else {
            router.push("/farmer-crm")
            return
          }
        }
      } catch (error) {
        console.error("Error loading machinery:", error)
        router.push("/farmer-crm")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndLoad()
  }, [params, router])

  const calculateTotalPrice = () => {
    if (!dateRange?.from || !dateRange?.to || !machinery) return 0
    const days = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return days * machinery.pricePerDay
  }

  const calculateDays = () => {
    if (!dateRange?.from || !dateRange?.to) return 0
    return Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1
  }

  const handleBookNow = () => {
    setShowBookingDialog(true)
  }

  const handleConfirmBooking = async () => {
    if (!dateRange?.from || !dateRange?.to || !userProfile || !machinery) {
      toast({
        title: "Invalid Selection",
        description: "Please select both start and end dates",
        variant: "destructive",
      })
      return
    }

    setIsBooking(true)

    try {
      const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      const totalDays = calculateDays()
      const totalPrice = calculateTotalPrice()

      const fuelCostPerDay = machinery.specifications?.["Fuel Consumption (L/day)"] 
        ? parseFloat(machinery.specifications["Fuel Consumption (L/day)"]) * 100 
        : 500
      const estimatedFuelCost = fuelIncluded ? fuelCostPerDay * totalDays : 0

      const request = {
        id: requestId,
        machineryId: machinery.id,
        machineryName: machinery.name,
        farmerEmail: userProfile.email,
        farmerName: userProfile.username,
        farmerPhone: userProfile.phone || "+91 XXXXXXXXXX",
        providerEmail: machinery.providerEmail,
        providerName: machinery.providerName,
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
        totalDays,
        totalPrice,
        fuelIncluded,
        fuelPaidBy: fuelIncluded ? fuelPaidBy : undefined,
        estimatedFuelCost: fuelIncluded ? estimatedFuelCost : undefined,
        fuelCostPerDay: fuelIncluded ? fuelCostPerDay : undefined,
        status: "pending" as const,
        farmerConfirmedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await saveRentalRequest(request)
      
      // Sync to localStorage for cross-window communication
      syncRentalRequest(request)

      toast({
        title: "Booking Request Sent!",
        description: "The provider will review your request shortly.",
      })

      setShowBookingDialog(false)
      router.push("/farmer-crm/my-rentals")
    } catch (error) {
      console.error("Booking failed:", error)
      toast({
        title: "Booking Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsBooking(false)
    }
  }

  if (isLoading || !machinery) {
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

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Main Image and Info */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="overflow-hidden">
              <div className="relative h-96 bg-gray-100">
                <Image
                  src={machinery.images[0]}
                  alt={machinery.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.jpg"
                  }}
                />
              </div>
            </Card>

            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{machinery.category}</Badge>
                  <Badge
                    variant={machinery.status === "available" ? "default" : "secondary"}
                    className={machinery.status === "available" ? "bg-green-500" : ""}
                  >
                    {machinery.status === "available" ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Available
                      </>
                    ) : (
                      machinery.status
                    )}
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold">{machinery.name}</h1>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{machinery.district}, {machinery.state}</span>
              </div>

              <Separator />

              {/* Provider Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Provider Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{machinery.providerName}</span>
                  </div>
                  {machinery.providerPhone && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {machinery.providerPhone}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Rating:</span>
                    <span className="font-medium flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {machinery.providerRating} / 5.0
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Price */}
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-4xl font-bold text-green-600">₹{machinery.pricePerDay}</p>
                      <p className="text-sm text-muted-foreground">per day</p>
                    </div>
                    <Button size="lg" onClick={handleBookNow} className="bg-green-600 hover:bg-green-700">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{machinery.description}</p>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  {Object.entries(machinery.specifications).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium">{key}</TableCell>
                      <TableCell>{value as string}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Reviews ({machinery.reviews.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {machinery.reviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No reviews yet</p>
              ) : (
                machinery.reviews.map((review: any, index: number) => (
                  <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{review.farmerName}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">{review.comment}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Booking Dialog - Responsive Landscape Layout */}
        <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
          <DialogContent className="!max-w-[95vw] sm:!max-w-[90vw] lg:!max-w-[1200px] xl:!max-w-[1400px] !w-auto max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl sm:text-2xl font-bold">Book {machinery.name}</DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                Select your rental dates to send a booking request
              </DialogDescription>
            </DialogHeader>
            
            {/* Three Column Responsive Layout - HORIZONTAL on desktop, VERTICAL on mobile */}
            <div className="flex flex-col lg:flex-row gap-5 items-start justify-center w-full">
              
              {/* LEFT BOX: Calendar Section */}
              <Card className="w-full lg:w-[360px] xl:w-[380px] flex-shrink-0 border border-gray-200 bg-white shadow-sm flex flex-col">
                <CardHeader className="pb-3 border-b border-gray-100">
                  <CardTitle className="text-base sm:text-lg font-semibold text-gray-800 text-center">Select Rental Period</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-start items-center py-4 px-4">
                  
                  {/* FIX APPLIED HERE: Added 'flex justify-center' to center the Calendar component */}
                  <div className="w-full flex justify-center">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      disabled={(date) => date < new Date()}
                      className="rounded-lg border border-gray-200"
                    />
                  </div>
                  
                  {dateRange?.from && dateRange?.to && (
                    <div className="mt-4 w-full bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="text-xs font-medium text-center text-gray-600 mb-2">Selected Period</p>
                      <p className="text-center font-semibold text-sm text-gray-800">
                        {dateRange.from.toLocaleDateString()} 
                      </p>
                      <p className="text-center font-medium text-xs text-gray-600 my-1">to</p>
                      <p className="text-center font-semibold text-sm text-gray-800">
                        {dateRange.to.toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {!dateRange?.from && (
                    <div className="mt-4 w-full bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-center text-gray-500 text-xs font-medium">Select start and end dates above</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* MIDDLE BOX: Fuel Options Section */}
              <Card className="w-full lg:w-[400px] xl:w-[420px] flex-shrink-0 border border-gray-200 bg-white shadow-sm flex flex-col">
                <CardHeader className="pb-3 border-b border-gray-100">
                  <CardTitle className="text-base sm:text-lg font-semibold text-gray-800 text-center">Fuel Options</CardTitle>
                  <p className="text-xs text-center pt-1 font-normal text-gray-500">Specify fuel payment responsibility</p>
                </CardHeader>
                <CardContent className="flex-1 space-y-4 py-4 px-4">
                  
                  {/* Fuel Toggle Switch */}
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <Label htmlFor="fuel-included" className="text-sm font-medium cursor-pointer text-gray-700">
                      Include Fuel Cost?
                    </Label>
                    <Switch
                      id="fuel-included"
                      checked={fuelIncluded}
                      onCheckedChange={setFuelIncluded}
                    />
                  </div>

                  {/* When Fuel is Enabled */}
                  {fuelIncluded && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium block text-gray-700">Who will pay for fuel?</Label>
                      
                      <RadioGroup 
                        value={fuelPaidBy} 
                        onValueChange={(value) => setFuelPaidBy(value as "farmer" | "provider" | "shared")} 
                        className="space-y-2"
                      >
                        {/* Farmer Pays Option */}
                        <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer">
                          <RadioGroupItem value="farmer" id="farmer" />
                          <Label htmlFor="farmer" className="font-normal cursor-pointer flex-1 text-sm text-gray-700">
                            Farmer pays fuel cost
                          </Label>
                        </div>
                        
                        {/* Provider Pays Option */}
                        <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer">
                          <RadioGroupItem value="provider" id="provider" />
                          <Label htmlFor="provider" className="font-normal cursor-pointer flex-1 text-sm text-gray-700">
                            Provider pays fuel cost
                          </Label>
                        </div>
                        
                        {/* Shared 50-50 Option */}
                        <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer">
                          <RadioGroupItem value="shared" id="shared" />
                          <Label htmlFor="shared" className="font-normal cursor-pointer flex-1 text-sm text-gray-700">
                            Shared 50-50 between both
                          </Label>
                        </div>
                      </RadioGroup>
                      
                      {/* Estimated Fuel Cost Display */}
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <p className="font-medium mb-1 text-xs text-gray-600">Est. fuel cost:</p>
                        <p className="text-gray-800 font-semibold text-xl">
                          ₹{machinery.specifications?.["Fuel Consumption (L/day)"] 
                            ? (parseFloat(machinery.specifications["Fuel Consumption (L/day)"]) * 100 * calculateDays()).toFixed(0)
                            : (500 * calculateDays()).toFixed(0)}
                        </p>
                        {fuelPaidBy === "shared" && (
                          <p className="text-xs mt-2 text-gray-600 font-normal">
                            (₹{machinery.specifications?.["Fuel Consumption (L/day)"] 
                              ? (parseFloat(machinery.specifications["Fuel Consumption (L/day)"]) * 100 * calculateDays() / 2).toFixed(0)
                              : (500 * calculateDays() / 2).toFixed(0)} each)
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* When Fuel is NOT Enabled */}
                  {!fuelIncluded && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm leading-relaxed text-gray-600 text-center">
                        Fuel cost not included. Discuss arrangements with provider separately.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* RIGHT BOX: Booking Summary Section */}
              <Card className="w-full lg:w-[360px] xl:w-[380px] flex-shrink-0 border border-gray-200 bg-white shadow-sm flex flex-col">
                <CardHeader className="pb-3 border-b border-gray-100">
                  <CardTitle className="text-base sm:text-lg font-semibold text-gray-800 text-center">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col py-4 px-4">
                  {dateRange?.from && dateRange?.to ? (
                    <>
                      <div className="space-y-3 flex-1">
                        {/* Duration Display */}
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <span className="text-xs text-gray-600 block mb-1 font-medium">Duration:</span>
                          <span className="font-semibold text-xl text-gray-800">{calculateDays()}</span>
                          <span className="font-medium text-base text-gray-700"> days</span>
                        </div>
                        
                        {/* Daily Rate Display */}
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <span className="text-xs text-gray-600 block mb-1 font-medium">Daily Rate:</span>
                          <span className="font-semibold text-lg text-gray-800">₹{machinery.pricePerDay}</span>
                        </div>
                        
                        {/* Subtotal Display */}
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <span className="text-xs text-gray-600 block mb-1 font-medium">Subtotal:</span>
                          <span className="font-semibold text-lg text-gray-800">₹{calculateTotalPrice()}</span>
                        </div>
                        
                        {/* Fuel Cost Display (if enabled) */}
                        {fuelIncluded && (
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <span className="text-xs text-gray-600 block mb-1 font-medium">Fuel Cost:</span>
                            <span className="font-semibold text-lg text-gray-800">
                              ₹{machinery.specifications?.["Fuel Consumption (L/day)"] 
                                ? (parseFloat(machinery.specifications["Fuel Consumption (L/day)"]) * 100 * calculateDays()).toFixed(0)
                                : (500 * calculateDays()).toFixed(0)}
                            </span>
                            <p className="text-xs text-gray-600 mt-1 font-normal">
                              Paid by: <span className="capitalize font-medium">{fuelPaidBy}</span>
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <Separator className="my-3 bg-gray-200" />
                      
                      {/* Total Amount Display */}
                      <div className="bg-green-600 text-white p-4 rounded-lg">
                        <span className="text-xs block mb-1 font-medium opacity-90">Total Amount:</span>
                        <span className="font-bold text-2xl">₹{calculateTotalPrice()}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-gray-200 p-6">
                      <CalendarIcon className="h-16 w-16 mx-auto mb-4 opacity-20 text-gray-400" />
                      <p className="text-sm font-medium text-gray-700 mb-1">No Dates Selected</p>
                      <p className="text-xs text-gray-500">Select rental dates to see summary</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Booking Confirmation Button */}
            <div className="pt-4">
              <Button
                className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700 text-white"
                onClick={handleConfirmBooking}
                disabled={!dateRange?.from || !dateRange?.to || isBooking}
              >
                {isBooking ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    Send Booking Request
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
