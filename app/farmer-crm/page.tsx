"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Filter,
  Loader2,
  MapPin,
  Star,
  TrendingUp,
  Search,
  DollarSign,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { isAuthenticated, getSession, getUserProfile, getAllMachinery, saveMachinery } from "@/lib/db"
import { useAppStore } from "@/lib/store"
import { INDIAN_STATES_DISTRICTS } from "@/lib/india-data"
import { mockMachineryData } from "@/lib/mock-data"
import { motion } from "framer-motion"
import Image from "next/image"

const CATEGORIES = ["Tractor", "Harvester", "Plough", "Seeder", "Sprayer", "Thresher", "Attachment", "Irrigation", "Other"]

export default function FarmerCRMPage() {
  const router = useRouter()
  const { userProfile, setUserProfile, setIsAuthenticated } = useAppStore()
  const [isLoading, setIsLoading] = useState(true)
  const [machinery, setMachinery] = useState<any[]>([])
  const [filteredMachinery, setFilteredMachinery] = useState<any[]>([])
  
  // Filters
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedState, setSelectedState] = useState<string>("")
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [minRating, setMinRating] = useState(0)
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)
  const [sortBy, setSortBy] = useState("relevance")

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
            
            // Check if user is a farmer
            if (profile.role !== "Farmer") {
              router.push("/dashboard")
              return
            }
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/auth")
      }

      // Load machinery data
      await loadMachineryData()
      setIsLoading(false)
    }

    checkAuth()
  }, [router, setUserProfile, setIsAuthenticated])

  const loadMachineryData = async () => {
    try {
      let existingMachinery = await getAllMachinery()
      
      // If no machinery exists, populate with mock data
      if (existingMachinery.length === 0) {
        for (const machine of mockMachineryData) {
          await saveMachinery(machine)
        }
        existingMachinery = await getAllMachinery()
      }
      
      setMachinery(existingMachinery)
      setFilteredMachinery(existingMachinery)
    } catch (error) {
      console.error("Failed to load machinery:", error)
    }
  }

  useEffect(() => {
    applyFilters()
  }, [searchQuery, selectedState, selectedDistrict, selectedCategories, priceRange, minRating, showAvailableOnly, sortBy, machinery])

  const applyFilters = () => {
    let filtered = [...machinery]

    // Search filter (very fast - searches name, category, description)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((m) => 
        m.name.toLowerCase().includes(query) ||
        m.category.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        m.providerName.toLowerCase().includes(query)
      )
    }

    // Location filters
    if (selectedState) {
      filtered = filtered.filter((m) => m.state === selectedState)
    }
    if (selectedDistrict) {
      filtered = filtered.filter((m) => m.district === selectedDistrict)
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((m) => selectedCategories.includes(m.category))
    }

    // Price range filter
    filtered = filtered.filter((m) => m.pricePerDay >= priceRange[0] && m.pricePerDay <= priceRange[1])

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter((m) => m.providerRating >= minRating)
    }

    // Availability filter
    if (showAvailableOnly) {
      filtered = filtered.filter((m) => m.status === "available")
    }

    // Sorting
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.pricePerDay - b.pricePerDay)
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.pricePerDay - a.pricePerDay)
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.providerRating - a.providerRating)
    }

    setFilteredMachinery(filtered)
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  const getDistrictsForState = () => {
    const state = INDIAN_STATES_DISTRICTS.find((s) => s.state === selectedState)
    return state?.districts || []
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
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-green-600">Machinery Rental</h1>
                <p className="text-sm text-muted-foreground">Find the perfect equipment for your farm</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.push("/farmer-crm/my-rentals")} className="gap-2">
              <Clock className="h-4 w-4" />
              My Rentals
            </Button>
          </div>
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, category, provider..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Location Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>State</Label>
                  <Select value={selectedState} onValueChange={(value) => {
                    setSelectedState(value)
                    setSelectedDistrict("")
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES_DISTRICTS.map((state) => (
                        <SelectItem key={state.state} value={state.state}>
                          {state.state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>District</Label>
                  <Select
                    value={selectedDistrict}
                    onValueChange={setSelectedDistrict}
                    disabled={!selectedState}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {getDistrictsForState().map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar Filters */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Filter */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Category</Label>
                  {CATEGORIES.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <label
                        htmlFor={category}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Range */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Price Per Day</Label>
                  <div className="pt-2">
                    <Slider
                      min={0}
                      max={10000}
                      step={100}
                      value={priceRange}
                      onValueChange={setPriceRange}
                    />
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Rating Filter */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Minimum Rating</Label>
                  <Select value={minRating.toString()} onValueChange={(v) => setMinRating(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any Rating</SelectItem>
                      <SelectItem value="3">3+ Stars</SelectItem>
                      <SelectItem value="4">4+ Stars</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Availability */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="available" className="text-base font-semibold">
                    Available Now Only
                  </Label>
                  <Switch
                    id="available"
                    checked={showAvailableOnly}
                    onCheckedChange={setShowAvailableOnly}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Sort and Results Count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredMachinery.length} result{filteredMachinery.length !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-2">
                <Label className="text-sm">Sort by:</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Machinery Grid */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredMachinery.map((machine) => (
                <motion.div
                  key={machine.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col"
                    onClick={() => router.push(`/farmer-crm/${machine.id}`)}
                  >
                    <div className="relative aspect-video w-full bg-gray-100 flex-shrink-0">
                      <Image
                        src={machine.images[0]}
                        alt={machine.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.jpg"
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant={machine.status === "available" ? "default" : "secondary"}
                          className={
                            machine.status === "available"
                              ? "bg-green-500 hover:bg-green-600"
                              : ""
                          }
                        >
                          {machine.status === "available" ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Available
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              {machine.status}
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-2 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg line-clamp-2">{machine.name}</h3>
                        <p className="text-sm text-muted-foreground">{machine.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {machine.district}, {machine.state}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{machine.providerRating}</span>
                        <span className="text-sm text-muted-foreground">
                          ({machine.reviews.length} reviews)
                        </span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-green-600">₹{machine.pricePerDay}</p>
                          <p className="text-xs text-muted-foreground">per day</p>
                        </div>
                        <Button size="sm">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredMachinery.length === 0 && (
              <Card className="p-12">
                <div className="text-center space-y-2">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="text-xl font-semibold">No machinery found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters to see more results
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
