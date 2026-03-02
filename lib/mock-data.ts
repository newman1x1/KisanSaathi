export const mockMachineryData = [
  {
    id: "mach-001",
    name: "John Deere 5310 GearPro Tractor",
    category: "Tractor",
    description: "Premium John Deere 5310 GearPro tractor, perfect for heavy-duty farming operations. This powerful machine features advanced hydraulics and excellent fuel efficiency. Ideal for ploughing, tilling, and hauling operations across large fields.",
    specifications: {
      "Engine Power": "55 HP",
      "Fuel Type": "Diesel",
      "Fuel Consumption (L/day)": "8",
      "Gearbox": "8 Forward + 4 Reverse",
      "Weight": "2100 kg",
      "Year": "2022",
      "Condition": "Excellent"
    },
    pricePerDay: 2500,
    providerEmail: "provider1@example.com",
    providerName: "Rajesh Kumar",
    providerRating: 4.8,
    providerPhone: "+91 98765 43210",
    state: "Punjab",
    district: "Ludhiana",
    images: ["/machinery/machinery-01.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Suresh Singh", rating: 5, comment: "Excellent tractor! Very powerful and fuel efficient.", date: "2025-09-15" },
      { farmerName: "Amit Patel", rating: 4, comment: "Good condition, helped me complete my work on time.", date: "2025-08-22" }
    ],
    createdAt: "2025-01-10T10:00:00Z"
  },
  {
    id: "mach-002",
    name: "Sonalika Tiger 55 Tractor",
    category: "Tractor",
    description: "Reliable Sonalika Tiger 55 tractor with robust build quality. Perfect for sugarcane farming and medium to heavy-duty agricultural operations. Well-maintained with regular servicing.",
    specifications: {
      "Engine Power": "55 HP",
      "Fuel Type": "Diesel",
      "Fuel Consumption (L/day)": "7.5",
      "Cylinders": "3",
      "Lifting Capacity": "2000 kg",
      "Year": "2021",
      "Condition": "Good"
    },
    pricePerDay: 2200,
    providerEmail: "demo.provider@kisansaathi.com",
    providerName: "Demo Provider",
    providerRating: 4.9,
    providerPhone: "+91 98765 00001",
    state: "Uttar Pradesh",
    district: "Meerut",
    images: ["/machinery/machinery-02.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Ramesh Kumar", rating: 5, comment: "Perfect for sugarcane fields. Highly recommended!", date: "2025-09-10" },
      { farmerName: "Gopal Sharma", rating: 4, comment: "Good tractor with adequate power.", date: "2025-08-05" }
    ],
    createdAt: "2025-01-12T09:30:00Z"
  },
  {
    id: "mach-003",
    name: "Mahindra Arjun Novo 605 DI-i",
    category: "Tractor",
    description: "Modern Mahindra Arjun Novo 605 DI-i tractor with advanced features. Excellent for paddy cultivation and diverse farming needs. Features comfortable seating and smooth operation.",
    specifications: {
      "Engine Power": "60 HP",
      "Fuel Type": "Diesel",
      "Fuel Consumption (L/day)": "9",
      "Transmission": "Synchromesh",
      "PTO Power": "52 HP",
      "Year": "2023",
      "Condition": "Excellent"
    },
    pricePerDay: 2800,
    providerEmail: "provider3@example.com",
    providerName: "Venkat Reddy",
    providerRating: 4.9,
    providerPhone: "+91 97788 55443",
    state: "Andhra Pradesh",
    district: "Guntur",
    images: ["/machinery/machinery-03.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Krishna Rao", rating: 5, comment: "Outstanding tractor! Very smooth operation.", date: "2025-09-20" },
      { farmerName: "Naresh Babu", rating: 5, comment: "Best tractor for paddy fields.", date: "2025-09-05" }
    ],
    createdAt: "2025-01-15T11:00:00Z"
  },
  {
    id: "mach-004",
    name: "Swaraj 855 FE Tractor",
    category: "Tractor",
    description: "Classic and reliable Swaraj 855 FE tractor. Time-tested workhorse for Indian farming conditions. Economical and easy to maintain. Perfect for small to medium-sized farms.",
    specifications: {
      "Engine Power": "50 HP",
      "Fuel Type": "Diesel",
      "Fuel Consumption (L/day)": "7",
      "Cylinders": "3",
      "Weight": "1950 kg",
      "Year": "2020",
      "Condition": "Good"
    },
    pricePerDay: 1800,
    providerEmail: "provider4@example.com",
    providerName: "Harpreet Singh",
    providerRating: 4.5,
    providerPhone: "+91 98220 11223",
    state: "Punjab",
    district: "Patiala",
    images: ["/machinery/machinery-04.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Baljeet Singh", rating: 4, comment: "Reliable and economical tractor.", date: "2025-08-28" },
      { farmerName: "Kuldeep Kaur", rating: 5, comment: "Perfect for my small farm.", date: "2025-08-15" }
    ],
    createdAt: "2025-01-08T08:00:00Z"
  },
  {
    id: "mach-005",
    name: "Claas Dominator Combine Harvester",
    category: "Harvester",
    description: "Professional-grade Claas Dominator combine harvester. Ideal for large-scale wheat harvesting operations. Features advanced threshing system and high grain tank capacity.",
    specifications: {
      "Engine Power": "230 HP",
      "Fuel Type": "Diesel",
      "Fuel Consumption (L/day)": "45",
      "Cutting Width": "5.5 meters",
      "Tank Capacity": "7500 liters",
      "Year": "2021",
      "Condition": "Excellent"
    },
    pricePerDay: 8500,
    providerEmail: "provider5@example.com",
    providerName: "Jaswinder Singh",
    providerRating: 4.9,
    providerPhone: "+91 98765 00112",
    state: "Punjab",
    district: "Bathinda",
    images: ["/machinery/machinery-05.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Gurpreet Singh", rating: 5, comment: "Harvested my entire 50-acre field in 2 days!", date: "2025-09-18" },
      { farmerName: "Manjeet Kaur", rating: 5, comment: "Excellent machine, saved me a lot of time and labor.", date: "2025-09-01" }
    ],
    createdAt: "2025-01-20T10:00:00Z"
  },
  {
    id: "mach-006",
    name: "Kubota Neostar B2741 Compact Tractor",
    category: "Tractor",
    description: "Compact and versatile Kubota Neostar B2741 tractor. Perfect for vegetable farming, orchards, and greenhouse operations. Easy to maneuver in tight spaces.",
    specifications: {
      "Engine Power": "27 HP",
      "Fuel Type": "Diesel",
      "Fuel Consumption (L/day)": "4",
      "Drive Type": "4WD",
      "Weight": "1200 kg",
      "Year": "2023",
      "Condition": "Excellent"
    },
    pricePerDay: 1500,
    providerEmail: "provider6@example.com",
    providerName: "Prakash Deshmukh",
    providerRating: 4.7,
    providerPhone: "+91 98443 22110",
    state: "Maharashtra",
    district: "Pune",
    images: ["/machinery/machinery-06.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Santosh Patil", rating: 5, comment: "Perfect for my vegetable farm. Very easy to operate.", date: "2025-09-12" },
      { farmerName: "Ramesh Jadhav", rating: 4, comment: "Compact and powerful. Good for small farms.", date: "2025-08-25" }
    ],
    createdAt: "2025-01-25T09:00:00Z"
  },
  {
    id: "mach-007",
    name: "New Holland 3630 TX Plus with Front Loader",
    category: "Tractor",
    description: "Versatile New Holland 3630 TX Plus tractor with front loader attachment. Excellent for material handling, loading, and general farm operations. Well-maintained and reliable.",
    specifications: {
      "Engine Power": "55 HP",
      "Fuel Type": "Diesel",
      "Fuel Consumption (L/day)": "8.5",
      "Loader Capacity": "1000 kg",
      "Transmission": "8F + 2R",
      "Year": "2022",
      "Condition": "Excellent"
    },
    pricePerDay: 2600,
    providerEmail: "provider7@example.com",
    providerName: "Mohan Lal",
    providerRating: 4.8,
    providerPhone: "+91 97654 33221",
    state: "Haryana",
    district: "Karnal",
    images: ["/machinery/machinery-07.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Vijay Kumar", rating: 5, comment: "Front loader is very useful for loading operations.", date: "2025-09-08" },
      { farmerName: "Rajesh Sharma", rating: 4, comment: "Good tractor with useful attachments.", date: "2025-08-20" }
    ],
    createdAt: "2025-01-18T10:30:00Z"
  },
  {
    id: "mach-008",
    name: "Massey Ferguson 241 DI Tractor",
    category: "Tractor",
    description: "Popular Massey Ferguson 241 DI tractor. Reliable and economical for various farming operations. Shows normal wear but runs perfectly. Regular servicing maintained.",
    specifications: {
      "Engine Power": "42 HP",
      "Fuel Type": "Diesel",
      "Cylinders": "3",
      "Weight": "1700 kg",
      "Year": "2019",
      "Condition": "Good"
    },
    pricePerDay: 1600,
    providerEmail: "provider8@example.com",
    providerName: "Ratan Singh",
    providerRating: 4.4,
    providerPhone: "+91 98332 11445",
    state: "Rajasthan",
    district: "Jaipur",
    images: ["/machinery/machinery-08.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Mahesh Kumar", rating: 4, comment: "Economical and reliable tractor.", date: "2025-08-30" },
      { farmerName: "Dinesh Choudhary", rating: 4, comment: "Good value for money.", date: "2025-08-10" }
    ],
    createdAt: "2025-01-05T08:30:00Z"
  },
  {
    id: "mach-009",
    name: "Farmtrac 60 Tractor",
    category: "Tractor",
    description: "Powerful Farmtrac 60 tractor with excellent tilling capabilities. Perfect for soil preparation and heavy-duty farming. Strong engine with good torque output.",
    specifications: {
      "Engine Power": "60 HP",
      "Fuel Type": "Diesel",
      "Transmission": "12F + 3R",
      "PTO Power": "54 HP",
      "Year": "2022",
      "Condition": "Excellent"
    },
    pricePerDay: 2400,
    providerEmail: "provider9@example.com",
    providerName: "Sukhdev Singh",
    providerRating: 4.7,
    providerPhone: "+91 98221 44556",
    state: "Punjab",
    district: "Amritsar",
    images: ["/machinery/machinery-09.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Balwinder Singh", rating: 5, comment: "Very powerful tractor for tilling work.", date: "2025-09-14" },
      { farmerName: "Paramjeet Kaur", rating: 4, comment: "Good tractor with strong engine.", date: "2025-08-28" }
    ],
    createdAt: "2025-01-22T09:15:00Z"
  },
  {
    id: "mach-010",
    name: "Eicher 380 Super Power Tractor",
    category: "Tractor",
    description: "Classic Eicher 380 Super Power tractor. Time-tested reliability and excellent fuel efficiency. Perfect for traditional farming operations. Easy to maintain and operate.",
    specifications: {
      "Engine Power": "38 HP",
      "Fuel Type": "Diesel",
      "Cylinders": "2",
      "Weight": "1650 kg",
      "Year": "2020",
      "Condition": "Good"
    },
    pricePerDay: 1400,
    providerEmail: "provider10@example.com",
    providerName: "Ram Prasad",
    providerRating: 4.5,
    providerPhone: "+91 97665 22334",
    state: "Uttar Pradesh",
    district: "Lucknow",
    images: ["/machinery/machinery-10.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Shyam Lal", rating: 4, comment: "Reliable and fuel-efficient tractor.", date: "2025-08-18" },
      { farmerName: "Hari Om", rating: 5, comment: "Perfect for my small farm needs.", date: "2025-08-05" }
    ],
    createdAt: "2025-01-07T10:00:00Z"
  },
  {
    id: "mach-011",
    name: "John Deere W70 Combine Harvester",
    category: "Harvester",
    description: "Advanced John Deere W70 combine harvester with large cutting header. Excellent for wheat and rice harvesting. Features modern grain handling and monitoring systems.",
    specifications: {
      "Engine Power": "170 HP",
      "Cutting Width": "4.5 meters",
      "Tank Capacity": "5500 liters",
      "Fuel Type": "Diesel",
      "Year": "2022",
      "Condition": "Excellent"
    },
    pricePerDay: 7500,
    providerEmail: "provider11@example.com",
    providerName: "Kulwinder Singh",
    providerRating: 4.8,
    providerPhone: "+91 98776 55443",
    state: "Haryana",
    district: "Ambala",
    images: ["/machinery/machinery-11.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Amarjeet Singh", rating: 5, comment: "Excellent harvester! Very efficient.", date: "2025-09-16" },
      { farmerName: "Harbhajan Singh", rating: 5, comment: "Best harvester I've used.", date: "2025-09-03" }
    ],
    createdAt: "2025-01-28T11:00:00Z"
  },
  {
    id: "mach-012",
    name: "Rotavator Attachment - Heavy Duty",
    category: "Attachment",
    description: "Professional-grade rotavator attachment for soil preparation. Compatible with most 45-60 HP tractors. Features strong blades and adjustable depth control. Freshly serviced.",
    specifications: {
      "Width": "6 feet",
      "Blades": "36 pieces",
      "Blade Type": "L-shaped",
      "Depth Range": "4-8 inches",
      "Year": "2021",
      "Condition": "Excellent"
    },
    pricePerDay: 800,
    providerEmail: "provider12@example.com",
    providerName: "Ashok Kumar",
    providerRating: 4.6,
    providerPhone: "+91 98554 33221",
    state: "Punjab",
    district: "Jalandhar",
    images: ["/machinery/machinery-12.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Surinder Pal", rating: 5, comment: "Excellent soil preparation. Very effective.", date: "2025-09-11" },
      { farmerName: "Davinder Singh", rating: 4, comment: "Good quality rotavator.", date: "2025-08-22" }
    ],
    createdAt: "2025-01-14T09:30:00Z"
  },
  {
    id: "mach-013",
    name: "Multi-Crop Thresher Machine",
    category: "Thresher",
    description: "Versatile multi-crop thresher suitable for wheat, rice, and other grains. High-capacity machine with efficient threshing mechanism. Easy to operate and maintain.",
    specifications: {
      "Power Required": "15-20 HP",
      "Capacity": "8-10 quintals/hour",
      "Threshing Type": "Drum",
      "Feed Type": "Manual",
      "Year": "2021",
      "Condition": "Good"
    },
    pricePerDay: 1200,
    providerEmail: "provider13@example.com",
    providerName: "Prabhu Dayal",
    providerRating: 4.5,
    providerPhone: "+91 97889 66554",
    state: "Uttar Pradesh",
    district: "Kanpur",
    images: ["/machinery/machinery-13.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Mukesh Kumar", rating: 4, comment: "Good threshing efficiency.", date: "2025-08-25" },
      { farmerName: "Rakesh Sharma", rating: 5, comment: "Very useful machine for post-harvest.", date: "2025-08-12" }
    ],
    createdAt: "2025-01-11T10:15:00Z"
  },
  {
    id: "mach-014",
    name: "Tractor-Pulled Seed Drill",
    category: "Seeder",
    description: "Precision seed drill for accurate sowing operations. Features adjustable seed rate and depth control. Suitable for wheat, soybean, and other crops. Well-maintained equipment.",
    specifications: {
      "Number of Rows": "9",
      "Row Spacing": "9 inches",
      "Hopper Capacity": "120 kg",
      "Seed Rate": "Adjustable",
      "Year": "2022",
      "Condition": "Excellent"
    },
    pricePerDay: 900,
    providerEmail: "provider14@example.com",
    providerName: "Kailash Yadav",
    providerRating: 4.7,
    providerPhone: "+91 98667 44332",
    state: "Madhya Pradesh",
    district: "Indore",
    images: ["/machinery/machinery-14.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Dilip Patel", rating: 5, comment: "Perfect seed placement. Excellent germination.", date: "2025-09-07" },
      { farmerName: "Anand Singh", rating: 4, comment: "Good seed drill with consistent performance.", date: "2025-08-19" }
    ],
    createdAt: "2025-01-19T08:45:00Z"
  },
  {
    id: "mach-015",
    name: "Agricultural Water Tanker with Sprinkler",
    category: "Irrigation",
    description: "Large capacity water tanker with sprinkler system for irrigation. Ideal for supplemental irrigation and dust suppression. Tractor-mounted with adjustable spray nozzles.",
    specifications: {
      "Capacity": "2500 liters",
      "Spray Width": "12 meters",
      "Pump Type": "Centrifugal",
      "Material": "MS Sheet",
      "Year": "2021",
      "Condition": "Good"
    },
    pricePerDay: 1000,
    providerEmail: "provider15@example.com",
    providerName: "Naresh Patel",
    providerRating: 4.6,
    providerPhone: "+91 98445 66778",
    state: "Gujarat",
    district: "Ahmedabad",
    images: ["/machinery/machinery-15.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Jayesh Shah", rating: 4, comment: "Good for supplemental irrigation.", date: "2025-08-28" },
      { farmerName: "Mehul Desai", rating: 5, comment: "Excellent coverage and water distribution.", date: "2025-08-15" }
    ],
    createdAt: "2025-01-16T09:00:00Z"
  },
  {
    id: "mach-016",
    name: "Heavy-Duty Farm Trolley",
    category: "Trolley",
    description: "Robust farm trolley for transporting produce and materials. High load capacity with hydraulic tipping mechanism. Suitable for various agricultural hauling needs.",
    specifications: {
      "Load Capacity": "5 tons",
      "Body Type": "MS Sheet",
      "Tipping": "Hydraulic",
      "Tyre Size": "7.50-16",
      "Year": "2020",
      "Condition": "Good"
    },
    pricePerDay: 700,
    providerEmail: "provider16@example.com",
    providerName: "Bharat Singh",
    providerRating: 4.4,
    providerPhone: "+91 97556 88990",
    state: "Punjab",
    district: "Moga",
    images: ["/machinery/machinery-16.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Lakhbir Singh", rating: 4, comment: "Strong trolley for heavy loads.", date: "2025-08-20" },
      { farmerName: "Gurdev Singh", rating: 4, comment: "Good capacity and reliable.", date: "2025-08-08" }
    ],
    createdAt: "2025-01-09T10:30:00Z"
  },
  {
    id: "mach-017",
    name: "Laser Land Leveler",
    category: "Land Preparation",
    description: "Advanced laser-guided land leveler for precision field leveling. Essential for water management and uniform crop growth. Saves water and increases yield. Professional equipment.",
    specifications: {
      "Leveling Width": "10 feet",
      "Laser System": "Automatic",
      "Accuracy": "±2 cm",
      "Power Required": "50-60 HP",
      "Year": "2022",
      "Condition": "Excellent"
    },
    pricePerDay: 2000,
    providerEmail: "provider17@example.com",
    providerName: "Jitender Kumar",
    providerRating: 4.9,
    providerPhone: "+91 98223 55667",
    state: "Haryana",
    district: "Sirsa",
    images: ["/machinery/machinery-17.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Satpal Singh", rating: 5, comment: "Excellent precision leveling. Worth every penny!", date: "2025-09-13" },
      { farmerName: "Manjeet Rana", rating: 5, comment: "Amazing results! Field is perfectly level.", date: "2025-08-29" }
    ],
    createdAt: "2025-01-24T11:15:00Z"
  },
  {
    id: "mach-018",
    name: "Post-Hole Digger Attachment",
    category: "Attachment",
    description: "Tractor-mounted post-hole digger for fencing and plantation work. Powerful auger with adjustable depth. Makes hole digging quick and effortless. Compatible with standard 3-point linkage.",
    specifications: {
      "Auger Diameter": "12 inches",
      "Max Depth": "6 feet",
      "Power Required": "35-50 HP",
      "Drive Type": "PTO",
      "Year": "2021",
      "Condition": "Good"
    },
    pricePerDay: 600,
    providerEmail: "provider18@example.com",
    providerName: "Balram Singh",
    providerRating: 4.5,
    providerPhone: "+91 98889 44556",
    state: "Punjab",
    district: "Sangrur",
    images: ["/machinery/machinery-18.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Jagtar Singh", rating: 4, comment: "Very useful for fencing work.", date: "2025-08-24" },
      { farmerName: "Randhir Singh", rating: 5, comment: "Saves a lot of manual labor.", date: "2025-08-11" }
    ],
    createdAt: "2025-01-13T09:45:00Z"
  },
  {
    id: "mach-019",
    name: "Power Tiller - Walk-Behind Type",
    category: "Tiller",
    description: "Compact walk-behind power tiller perfect for vegetable gardens and small plots. Easy to operate and maneuver. Ideal for inter-cultivation and weeding operations.",
    specifications: {
      "Engine Power": "7 HP",
      "Fuel Type": "Petrol",
      "Tilling Width": "24 inches",
      "Tilling Depth": "6 inches",
      "Year": "2022",
      "Condition": "Excellent"
    },
    pricePerDay: 500,
    providerEmail: "provider19@example.com",
    providerName: "Suresh Reddy",
    providerRating: 4.6,
    providerPhone: "+91 97778 33221",
    state: "Telangana",
    district: "Hyderabad",
    images: ["/machinery/machinery-19.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Ravi Kumar", rating: 5, comment: "Perfect for my vegetable garden.", date: "2025-09-09" },
      { farmerName: "Srinivas Rao", rating: 4, comment: "Easy to operate and very effective.", date: "2025-08-26" }
    ],
    createdAt: "2025-01-21T10:00:00Z"
  },
  {
    id: "mach-020",
    name: "Boom Sprayer - Large Coverage",
    category: "Sprayer",
    description: "Professional boom sprayer with wide coverage for pesticide and fertilizer application. Features adjustable nozzles and uniform spray pattern. Ideal for large fields and commercial farming.",
    specifications: {
      "Tank Capacity": "400 liters",
      "Boom Width": "12 meters",
      "Nozzles": "24 pieces",
      "Pump Type": "Piston",
      "Year": "2021",
      "Condition": "Excellent"
    },
    pricePerDay: 1100,
    providerEmail: "provider20@example.com",
    providerName: "Shankar Pawar",
    providerRating: 4.7,
    providerPhone: "+91 98334 77889",
    state: "Maharashtra",
    district: "Nashik",
    images: ["/machinery/machinery-20.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Anil Jadhav", rating: 5, comment: "Excellent coverage. Saves time and chemicals.", date: "2025-09-06" },
      { farmerName: "Sachin Patil", rating: 4, comment: "Good sprayer with uniform application.", date: "2025-08-23" }
    ],
    createdAt: "2025-01-17T08:30:00Z"
  },
  {
    id: "mach-021",
    name: "Potato Planter Machine",
    category: "Planter",
    description: "Specialized potato planter for efficient and uniform planting. Features automatic seed placement and furrow opening. Adjustable row spacing. Perfect for commercial potato cultivation.",
    specifications: {
      "Number of Rows": "2",
      "Row Spacing": "Adjustable (24-30 inches)",
      "Hopper Capacity": "80 kg",
      "Power Required": "35-45 HP",
      "Year": "2022",
      "Condition": "Excellent"
    },
    pricePerDay: 1300,
    providerEmail: "provider21@example.com",
    providerName: "Mahesh Singh",
    providerRating: 4.8,
    providerPhone: "+91 98667 22334",
    state: "Uttar Pradesh",
    district: "Agra",
    images: ["/machinery/machinery-21.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Virendra Kumar", rating: 5, comment: "Perfect for potato planting. Very precise.", date: "2025-09-04" },
      { farmerName: "Rajesh Tyagi", rating: 4, comment: "Good machine with consistent spacing.", date: "2025-08-21" }
    ],
    createdAt: "2025-01-26T09:15:00Z"
  },
  {
    id: "mach-022",
    name: "Sugarcane Harvester",
    category: "Harvester",
    description: "Heavy-duty sugarcane harvester for efficient cane cutting and loading. Reduces manual labor significantly. Suitable for large sugarcane plantations. Well-maintained professional equipment.",
    specifications: {
      "Engine Power": "180 HP",
      "Cutting System": "Base Cutter",
      "Capacity": "40-50 tons/day",
      "Fuel Type": "Diesel",
      "Year": "2021",
      "Condition": "Good"
    },
    pricePerDay: 6500,
    providerEmail: "provider22@example.com",
    providerName: "Gopal Verma",
    providerRating: 4.6,
    providerPhone: "+91 97889 55443",
    state: "Uttar Pradesh",
    district: "Muzaffarnagar",
    images: ["/machinery/machinery-22.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Charan Singh", rating: 5, comment: "Excellent machine for sugarcane harvesting.", date: "2025-09-02" },
      { farmerName: "Mohan Lal", rating: 4, comment: "Good harvester, saves a lot of labor.", date: "2025-08-17" }
    ],
    createdAt: "2025-01-23T10:45:00Z"
  },
  {
    id: "mach-023",
    name: "Paddy Transplanter - Self-Propelled",
    category: "Transplanter",
    description: "Modern self-propelled paddy transplanter for efficient rice planting. Features automatic seedling pick-up and planting. Saves labor and ensures uniform plant spacing. Perfect for rice cultivation.",
    specifications: {
      "Number of Rows": "6",
      "Row Spacing": "9 inches",
      "Planting Depth": "Adjustable",
      "Power": "Self-propelled (12 HP)",
      "Year": "2022",
      "Condition": "Excellent"
    },
    pricePerDay: 1800,
    providerEmail: "provider23@example.com",
    providerName: "Murugan Pillai",
    providerRating: 4.8,
    providerPhone: "+91 98776 44332",
    state: "Tamil Nadu",
    district: "Thanjavur",
    images: ["/machinery/machinery-23.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Selvam Kumar", rating: 5, comment: "Excellent transplanter. Very efficient.", date: "2025-09-10" },
      { farmerName: "Kannan Raju", rating: 5, comment: "Best machine for paddy planting.", date: "2025-08-27" }
    ],
    createdAt: "2025-01-27T11:30:00Z"
  },
  {
    id: "mach-024",
    name: "Forage Harvester (Chaff Cutter)",
    category: "Forage Equipment",
    description: "Powerful forage harvester for cutting and chopping green fodder. Ideal for dairy farms and livestock feeding. High-capacity machine with adjustable cutting length.",
    specifications: {
      "Power Required": "10-15 HP",
      "Cutting Length": "Adjustable (1-3 inches)",
      "Capacity": "2-3 tons/hour",
      "Feed Type": "Manual",
      "Year": "2020",
      "Condition": "Good"
    },
    pricePerDay: 800,
    providerEmail: "provider24@example.com",
    providerName: "Gajendra Singh",
    providerRating: 4.5,
    providerPhone: "+91 98554 66778",
    state: "Rajasthan",
    district: "Udaipur",
    images: ["/machinery/machinery-24.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Pratap Singh", rating: 4, comment: "Good chaff cutter for livestock feed.", date: "2025-08-22" },
      { farmerName: "Bhim Singh", rating: 5, comment: "Very useful for dairy farming.", date: "2025-08-09" }
    ],
    createdAt: "2025-01-10T09:00:00Z"
  },
  {
    id: "mach-025",
    name: "Round Hay Baler",
    category: "Baler",
    description: "Professional round hay baler for efficient hay and straw baling. Creates dense, weather-resistant bales. Ideal for fodder storage and transportation. Well-maintained equipment.",
    specifications: {
      "Bale Diameter": "4 feet",
      "Bale Weight": "300-400 kg",
      "Power Required": "50-60 HP",
      "Drive Type": "PTO",
      "Year": "2021",
      "Condition": "Excellent"
    },
    pricePerDay: 1500,
    providerEmail: "provider25@example.com",
    providerName: "Amarjeet Kaur",
    providerRating: 4.7,
    providerPhone: "+91 98445 33221",
    state: "Punjab",
    district: "Fazilka",
    images: ["/machinery/machinery-25.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Kuldip Singh", rating: 5, comment: "Excellent baling. Very efficient.", date: "2025-09-05" },
      { farmerName: "Simranjeet Kaur", rating: 4, comment: "Good quality bales. Reliable machine.", date: "2025-08-18" }
    ],
    createdAt: "2025-01-15T10:15:00Z"
  },
  {
    id: "mach-026",
    name: "Heavy-Duty Disc Plough",
    category: "Plough",
    description: "Robust disc plough for deep tillage and soil preparation. Features large, sharp discs for effective cutting. Suitable for hard and rocky soils. Compatible with high HP tractors.",
    specifications: {
      "Number of Discs": "3",
      "Disc Diameter": "26 inches",
      "Working Width": "30 inches",
      "Power Required": "55-75 HP",
      "Year": "2021",
      "Condition": "Good"
    },
    pricePerDay: 700,
    providerEmail: "provider26@example.com",
    providerName: "Ramesh Chandra",
    providerRating: 4.6,
    providerPhone: "+91 97667 88990",
    state: "Madhya Pradesh",
    district: "Bhopal",
    images: ["/machinery/machinery-26.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Dinesh Sharma", rating: 4, comment: "Good plough for hard soil.", date: "2025-08-25" },
      { farmerName: "Arvind Kumar", rating: 5, comment: "Excellent penetration and soil turning.", date: "2025-08-12" }
    ],
    createdAt: "2025-01-12T08:45:00Z"
  },
  {
    id: "mach-027",
    name: "Spring-Loaded Cultivator",
    category: "Cultivator",
    description: "Multi-tine spring-loaded cultivator for secondary tillage. Excellent for weed control and soil aeration. Spring-loaded design protects against obstacles. Good fuel efficiency.",
    specifications: {
      "Number of Tines": "11",
      "Working Width": "7 feet",
      "Spring Type": "Heavy Duty",
      "Power Required": "35-50 HP",
      "Year": "2020",
      "Condition": "Good"
    },
    pricePerDay: 600,
    providerEmail: "provider27@example.com",
    providerName: "Jagdish Patel",
    providerRating: 4.5,
    providerPhone: "+91 98889 22334",
    state: "Gujarat",
    district: "Vadodara",
    images: ["/machinery/machinery-27.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Kishore Shah", rating: 4, comment: "Good for secondary tillage operations.", date: "2025-08-20" },
      { farmerName: "Nilesh Patel", rating: 4, comment: "Effective weed control.", date: "2025-08-07" }
    ],
    createdAt: "2025-01-08T09:30:00Z"
  },
  {
    id: "mach-028",
    name: "Compact Power Sprayer Unit",
    category: "Sprayer",
    description: "Portable power sprayer unit mounted on utility vehicle. Ideal for orchard spraying and pest control. Features high-pressure pump and long hose reach. Easy to transport.",
    specifications: {
      "Tank Capacity": "200 liters",
      "Pump Type": "Piston (High Pressure)",
      "Hose Length": "50 meters",
      "Engine": "Petrol (5 HP)",
      "Year": "2022",
      "Condition": "Excellent"
    },
    pricePerDay: 900,
    providerEmail: "provider28@example.com",
    providerName: "Sanjay Mehta",
    providerRating: 4.7,
    providerPhone: "+91 98223 66778",
    state: "Maharashtra",
    district: "Nagpur",
    images: ["/machinery/machinery-28.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Vinod Deshmukh", rating: 5, comment: "Perfect for orchard spraying.", date: "2025-09-08" },
      { farmerName: "Ajay Raut", rating: 4, comment: "Good pressure and coverage.", date: "2025-08-24" }
    ],
    createdAt: "2025-01-20T10:00:00Z"
  },
  {
    id: "mach-029",
    name: "Zero-Till Seed Drill",
    category: "Seeder",
    description: "Modern zero-till seed drill for conservation agriculture. Allows direct seeding without prior tillage. Saves fuel, time, and soil moisture. Excellent for sustainable farming practices.",
    specifications: {
      "Number of Rows": "9",
      "Row Spacing": "9 inches",
      "Hopper Capacity": "150 kg",
      "Furrow Opener": "Inverted T-type",
      "Year": "2022",
      "Condition": "Excellent"
    },
    pricePerDay: 1200,
    providerEmail: "provider29@example.com",
    providerName: "Yogesh Kumar",
    providerRating: 4.8,
    providerPhone: "+91 97778 55443",
    state: "Haryana",
    district: "Hisar",
    images: ["/machinery/machinery-29.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Deepak Malik", rating: 5, comment: "Excellent for zero-till farming. Highly recommend!", date: "2025-09-12" },
      { farmerName: "Rohit Sharma", rating: 5, comment: "Saves time and resources. Great machine.", date: "2025-08-28" }
    ],
    createdAt: "2025-01-25T11:00:00Z"
  },
  {
    id: "mach-030",
    name: "Cage Wheel Set for Paddy Field",
    category: "Attachment",
    description: "Specialized cage wheels for tractor operation in flooded paddy fields. Provides excellent traction in muddy conditions. Essential for rice cultivation in waterlogged fields.",
    specifications: {
      "Diameter": "48 inches",
      "Width": "12 inches",
      "Material": "MS Steel",
      "Compatibility": "Standard tractors",
      "Year": "2021",
      "Condition": "Good"
    },
    pricePerDay: 500,
    providerEmail: "provider30@example.com",
    providerName: "Krishna Reddy",
    providerRating: 4.6,
    providerPhone: "+91 98667 44556",
    state: "Andhra Pradesh",
    district: "West Godavari",
    images: ["/machinery/machinery-30.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Subba Rao", rating: 4, comment: "Essential for paddy field operations.", date: "2025-08-19" },
      { farmerName: "Venu Gopal", rating: 5, comment: "Great traction in muddy fields.", date: "2025-08-06" }
    ],
    createdAt: "2025-01-11T09:45:00Z"
  },
  {
    id: "mach-031",
    name: "Agricultural Drone with Sprayer",
    category: "Drone",
    description: "Modern agricultural drone with precision spraying system. Ideal for pesticide and fertilizer application in difficult terrain. Features GPS navigation and automated flight control.",
    specifications: {
      "Tank Capacity": "10 liters",
      "Flight Time": "20 minutes",
      "Coverage": "8-10 acres/hour",
      "Control": "Remote + GPS",
      "Year": "2023",
      "Condition": "Excellent"
    },
    pricePerDay: 3500,
    providerEmail: "provider31@example.com",
    providerName: "Arjun Mehta",
    providerRating: 4.9,
    providerPhone: "+91 98334 88990",
    state: "Karnataka",
    district: "Bangalore",
    images: ["/machinery/machinery-31.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Naveen Kumar", rating: 5, comment: "Amazing technology! Very precise spraying.", date: "2025-09-15" },
      { farmerName: "Prasad Gowda", rating: 5, comment: "Perfect for hilly terrain. Excellent investment.", date: "2025-09-01" }
    ],
    createdAt: "2025-02-01T10:30:00Z"
  },
  {
    id: "mach-032",
    name: "Solar Water Pump System",
    category: "Irrigation",
    description: "Eco-friendly solar-powered water pump with panels and controller. Perfect for irrigation without electricity. Reliable and cost-effective. Complete system with installation support.",
    specifications: {
      "Pump Power": "3 HP",
      "Solar Panel": "2000 watts",
      "Head": "100 feet",
      "Flow Rate": "120 LPM",
      "Year": "2022",
      "Condition": "Excellent"
    },
    pricePerDay: 1200,
    providerEmail: "provider32@example.com",
    providerName: "Deepak Joshi",
    providerRating: 4.8,
    providerPhone: "+91 97889 77665",
    state: "Rajasthan",
    district: "Jodhpur",
    images: ["/machinery/machinery-32.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Hanuman Ram", rating: 5, comment: "Excellent solution for remote fields. No electricity needed!", date: "2025-09-11" },
      { farmerName: "Kishan Lal", rating: 4, comment: "Good pump with reliable solar system.", date: "2025-08-26" }
    ],
    createdAt: "2025-01-29T09:15:00Z"
  },
  {
    id: "mach-033",
    name: "Automatic Milking Machine",
    category: "Dairy Equipment",
    description: "Modern automatic milking machine for dairy farms. Features gentle vacuum system and hygienic milk collection. Increases milking efficiency and reduces labor. Suitable for 10-20 cows.",
    specifications: {
      "Type": "Bucket System",
      "Capacity": "2 cows simultaneously",
      "Vacuum Pump": "0.5 HP",
      "Bucket Capacity": "25 liters each",
      "Year": "2021",
      "Condition": "Excellent"
    },
    pricePerDay: 600,
    providerEmail: "provider33@example.com",
    providerName: "Dhananjay Patil",
    providerRating: 4.7,
    providerPhone: "+91 98445 55667",
    state: "Maharashtra",
    district: "Kolhapur",
    images: ["/machinery/machinery-33.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Maruti Kale", rating: 5, comment: "Very hygienic and efficient milking.", date: "2025-09-07" },
      { farmerName: "Sharad More", rating: 4, comment: "Good machine for dairy operations.", date: "2025-08-21" }
    ],
    createdAt: "2025-01-16T10:45:00Z"
  },
  {
    id: "mach-034",
    name: "Petrol-Powered Brush Cutter",
    category: "Land Clearing",
    description: "Powerful brush cutter for clearing overgrown vegetation and weeds. Features high-speed cutting blade and comfortable harness. Ideal for farm boundary maintenance and land clearing.",
    specifications: {
      "Engine Power": "2 HP",
      "Fuel Type": "Petrol",
      "Cutting Width": "18 inches",
      "Blade Type": "Metal (3-tooth)",
      "Year": "2022",
      "Condition": "Excellent"
    },
    pricePerDay: 400,
    providerEmail: "provider34@example.com",
    providerName: "Sunil Tomar",
    providerRating: 4.6,
    providerPhone: "+91 98223 44556",
    state: "Uttarakhand",
    district: "Dehradun",
    images: ["/machinery/machinery-34.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Vijay Rawat", rating: 4, comment: "Good for clearing tough vegetation.", date: "2025-08-23" },
      { farmerName: "Ashok Negi", rating: 5, comment: "Powerful and easy to use.", date: "2025-08-10" }
    ],
    createdAt: "2025-01-14T09:00:00Z"
  },
  {
    id: "mach-035",
    name: "Tractor Attachment Set (Combo)",
    category: "Attachment",
    description: "Complete set of essential tractor attachments including plough, cultivator, and rotavator. All implements are well-maintained and ready to use. Perfect combo for comprehensive farm operations.",
    specifications: {
      "Includes": "Plough + Cultivator + Rotavator",
      "Plough": "2-bottom disc",
      "Cultivator": "9-tine",
      "Rotavator": "5 feet",
      "Year": "2020",
      "Condition": "Good"
    },
    pricePerDay: 1500,
    providerEmail: "provider35@example.com",
    providerName: "Tejpal Singh",
    providerRating: 4.7,
    providerPhone: "+91 97556 77889",
    state: "Punjab",
    district: "Ferozepur",
    images: ["/machinery/machinery-35.jpeg"],
    availability: [],
    status: "available" as const,
    reviews: [
      { farmerName: "Gurpreet Singh", rating: 5, comment: "Complete solution for all my needs. Great value!", date: "2025-09-03" },
      { farmerName: "Harjeet Kaur", rating: 4, comment: "Good quality attachments. Well-maintained.", date: "2025-08-16" }
    ],
    createdAt: "2025-01-06T10:30:00Z"
  }
]
