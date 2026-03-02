// lib/gov-schemes.ts

export interface Scheme {
  id: number;
  title: string;
  objective: string;
  description: string;
  benefits: string[];
  eligibility: string[];
  applicationProcess: string;
  requiredDocuments: string[];
  website: string;
  keywords: string[];
}

export const governmentSchemes: Scheme[] = [
  {
    id: 1,
    title: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    objective: "To provide direct income support to all landholding farmer families to supplement their financial needs for procuring agricultural inputs and meeting domestic expenses.",
    description: "PM-KISAN is a Central Sector scheme that provides a financial benefit of ₹6,000 per year to eligible farmer families. This amount is disbursed in three equal four-monthly installments of ₹2,000 each, transferred directly into the bank accounts of the beneficiaries.",
    benefits: [
      "Provides a direct and regular source of income, offering financial stability.",
      "Helps farmers meet expenses for agricultural inputs like seeds and fertilizers.",
      "Reduces dependence on local moneylenders for small, recurring expenses.",
      "Empowers farmers with financial autonomy for both agricultural and domestic needs."
    ],
    eligibility: [
      "All landholding farmer families (husband, wife, and minor children) who own cultivable land.",
      "Excludes institutional landholders, families with members in constitutional posts, government employees (with exceptions), and income tax payers."
    ],
    applicationProcess: "Farmers can register through the official PM-KISAN portal, the mobile app, or their nearest Common Service Centre (CSC). eKYC is mandatory.",
    requiredDocuments: [
      "Aadhaar Card (mandatory)",
      "Land ownership documents (Records of Right, Land Possession Certificate)",
      "Savings Bank Account details",
      "Proof of citizenship"
    ],
    website: "https://pmkisan.gov.in/",
    keywords: ["PM Kisan", "farmer 6000 rupees scheme", "kisan samman nidhi registration", "farmer income support", "check pm kisan status", "eKYC for PM Kisan", "new farmer registration PM Kisan", "PM Kisan beneficiary list"]
  },
  {
    id: 2,
    title: "PM Kisan Maan Dhan Yojana (PM-KMY)",
    objective: "To provide a social security net in the form of a monthly pension to Small and Marginal Farmers (SMFs) in their old age.",
    description: "A voluntary and contributory pension scheme where eligible farmers contribute a monthly amount (₹55 to ₹200) depending on their entry age. The Central Government makes an equal matching contribution. Upon reaching 60, the farmer receives a minimum fixed pension of ₹3,000 per month.",
    benefits: [
      "Assured monthly pension of ₹3,000 after age 60.",
      "In case of the pensioner's death, the spouse receives 50% of the pension as a family pension.",
      "The government's matching contribution doubles the farmer's savings.",
      "Flexible exit policy with the return of contributions plus interest."
    ],
    eligibility: [
      "Small and Marginal Farmers (SMF) with cultivable landholding up to 2 hectares.",
      "Entry age between 18 to 40 years.",
      "Excludes farmers covered under other social security schemes or those with higher income."
    ],
    applicationProcess: "Enrollment can be done offline via the nearest Common Service Centre (CSC) or through online self-registration on the MAANDHAN portal.",
    requiredDocuments: [
      "Aadhaar Card",
      "Savings Bank Account Passbook or PM-KISAN account details"
    ],
    website: "https://pmkmy.gov.in/",
    keywords: ["farmer pension scheme", "PMKMY registration", "old age pension for farmers", "PM Maan Dhan Yojana", "kisan pension online apply", "small farmer social security", "pension for marginal farmers"]
  },
  {
    id: 3,
    title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    objective: "To provide comprehensive insurance coverage and financial support to farmers against crop loss or damage arising out of unforeseen, non-preventable natural events.",
    description: "A flagship crop insurance scheme covering all stages of the crop cycle (pre-sowing to post-harvest) against risks like drought, floods, pests, and natural fire. Farmers pay a low uniform premium (2% for Kharif, 1.5% for Rabi, 5% for commercial crops), with the government subsidizing the rest.",
    benefits: [
      "Affordable premiums with significant government subsidy.",
      "Comprehensive risk coverage from pre-sowing to post-harvest stages.",
      "Farmers receive the full insured sum without any reduction or capping.",
      "Uses modern technology like drones and satellite imagery for faster claim settlement."
    ],
    eligibility: [
      "All farmers, including sharecroppers and tenant farmers, growing notified crops in notified areas.",
      "The farmer must have an insurable interest in the notified crop."
    ],
    applicationProcess: "Enrollment can be done through financial institutions (for loanee farmers), the National Crop Insurance Portal (NCIP), or offline via banks, CSCs, or authorized agents.",
    requiredDocuments: [
      "Duly filled proposal form",
      "Land records or applicable contract/agreement",
      "Sowing declaration",
      "Aadhaar card",
      "Bank account passbook"
    ],
    website: "https://pmfby.gov.in/",
    keywords: ["crop insurance scheme", "fasal bima yojana online apply", "PMFBY claim status", "natural disaster crop loss compensation", "hailstorm crop damage insurance", "drought relief for farmers", "PMFBY premium calculator"]
  },
  {
    id: 4,
    title: "Restructured Weather Based Crop Insurance Scheme (RWBCIS)",
    objective: "To provide financial protection to farmers against anticipated crop losses resulting from adverse weather incidences like deficit rainfall, adverse temperature, etc.",
    description: "A parametric insurance scheme where compensation is triggered by deviations in pre-defined weather parameters, not actual crop loss. Payouts are automatic if weather data from a Reference Weather Station breaches the defined triggers, ensuring faster and more transparent claim settlement.",
    benefits: [
      "Quick and transparent payouts based on objective weather data.",
      "Reduced administrative burden as it minimizes the need for crop damage surveys.",
      "Covers specific weather risks like unseasonal rain, dry spells, and temperature fluctuations.",
      "Option for states to include add-on coverage for localized risks like hailstorms."
    ],
    eligibility: [
      "All farmers growing notified crops in areas where the scheme is implemented."
    ],
    applicationProcess: "Similar to PMFBY, enrollment is done through the National Crop Insurance Portal, financial institutions, CSCs, or authorized agents before the seasonal cut-off date.",
    requiredDocuments: [
      "Land records proving insurable interest",
      "Aadhaar card",
      "Bank account details",
      "Sowing declaration or certificate"
    ],
    website: "https://pmfby.gov.in/",
    keywords: ["weather based crop insurance", "RWBCIS scheme", "rainfall insurance for crops", "heat wave crop insurance", "parametric crop insurance", "crop insurance without damage survey", "weather index insurance"]
  },
  {
    id: 5,
    title: "Pradhan Mantri Annadata Aay SanraksHan Abhiyan (PM-AASHA)",
    objective: "To ensure that farmers receive remunerative prices, specifically the Minimum Support Price (MSP), for their produce of notified pulses, oilseeds, and copra.",
    description: "An umbrella scheme with three components states can choose from: 1) Price Support Scheme (PSS) for physical procurement at MSP by agencies like NAFED, 2) Price Deficiency Payment Scheme (PDPS) where farmers are directly paid the difference between MSP and market price, and 3) Pilot of Private Procurement & Stockist Scheme (PPSS).",
    benefits: [
      "Ensures farmers realize the declared MSP for their crops.",
      "Offers flexibility to states to choose the most suitable price support mechanism.",
      "Reduces the government's logistical burden through the PDPS component.",
      "Protects farmers from making distress sales at low prices post-harvest."
    ],
    eligibility: [
      "Farmers growing notified pulses, oilseeds, and copra in states implementing the scheme.",
      "Farmers must be pre-registered on designated procurement portals."
    ],
    applicationProcess: "Farmers need to register on the digital platforms of Central Nodal Agencies (e.g., NAFED's e-Samriddhi portal) or state procurement portals before the procurement season.",
    requiredDocuments: [
      "Aadhaar number",
      "Valid land records (e.g., Record of Rights)",
      "Bank account details for direct payment",
      "Details of the crop sown"
    ],
    website: "https://www.nafed-india.com/",
    keywords: ["MSP scheme", "price support for farmers", "PM AASHA registration", "selling crops at MSP", "government buying pulses", "oilseed MSP payment", "NAFED procurement", "price deficiency payment"]
  },
  {
    id: 6,
    title: "Group Accident Insurance Scheme for Fishermen (GAIS)",
    objective: "To provide financial security and a social safety net to fishers and their families against the risk of accidental death or disability.",
    description: "A sub-component of the Pradhan Mantri Matsya Sampada Yojana (PMMSY) that provides accident insurance coverage to individuals in fishing and allied activities. The entire premium is borne by the government, offering coverage at no cost to the beneficiaries.",
    benefits: [
      "Provides ₹5.00 lakh coverage for accidental death or permanent total disability.",
      "Offers ₹2.50 lakh compensation for permanent partial disability.",
      "Includes up to ₹25,000 for accidental hospitalization expenses.",
      "Offers financial security to families at no personal cost."
    ],
    eligibility: [
      "All fishers, fish workers, and fish farmers aged 18 to 70 years.",
      "Any person directly involved in fisheries-related activities."
    ],
    applicationProcess: "Enrollment is generally facilitated by the respective State/UT Department of Fisheries, which collects and consolidates the data of eligible fishers to enroll them under a master policy.",
    requiredDocuments: [
      "For Enrollment: Proof of identity, age, address, and engagement in fisheries activities.",
      "For Claim: Claim form, FIR copy, post-mortem report (if applicable), disability certificate, and bank details."
    ],
    website: "https://gaispmmsy.com/",
    keywords: ["insurance for fishermen", "fisherman accident scheme", "matsya sampada yojana insurance", "GAIS for fishers", "death compensation for fisherman", "disability insurance for fish farmers", "PMMSY accident cover"]
  },
  {
    id: 7,
    title: "Kisan Credit Card (KCC) Scheme",
    objective: "To provide adequate and timely credit support from the banking system to farmers for their cultivation and other needs under a single window.",
    description: "A revolving credit facility that covers short-term credit for crop cultivation, post-harvest expenses, consumption needs, and farm asset maintenance. The card is valid for 5 years and has been extended to include animal husbandry and fisheries.",
    benefits: [
      "Flexible, revolving credit line, eliminating repeated loan applications.",
      "Ensures timely credit for purchasing inputs.",
      "Offers credit at a concessional interest rate.",
      "Collateral-free loans available up to ₹1.60 lakh."
    ],
    eligibility: [
      "Owner-cultivators (individual or joint).",
      "Tenant farmers, oral lessees, and sharecroppers.",
      "Self Help Groups (SHGs) or Joint Liability Groups (JLGs).",
      "Farmers in animal husbandry and fisheries."
    ],
    applicationProcess: "Farmers can apply at the nearest branch of a commercial bank, RRB, or cooperative bank, or download the form from the bank's website. A simplified form is available for PM-KISAN beneficiaries.",
    requiredDocuments: [
      "Application form",
      "Proof of Identity (Aadhaar, PAN, etc.)",
      "Proof of Address",
      "Land documents",
      "Passport-size photographs"
    ],
    website: "https://www.jansamarth.in/kisan-credit-card-scheme",
    keywords: ["Kisan Credit Card", "KCC apply online", "farmer loan scheme", "agricultural loan", "KCC interest rate", "SBI KCC", "loan for tractor", "crop loan"]
  },
  {
    id: 8,
    title: "Interest Subvention Scheme for Farmers",
    objective: "To make short-term agricultural credit available to farmers at a concessional rate of interest.",
    description: "Provides an interest subsidy to lending institutions, allowing them to offer short-term crop loans (up to ₹3 lakh) at 7% per annum. An additional 3% subvention is given for prompt repayment, making the effective interest rate 4%.",
    benefits: [
      "Reduces effective interest rate to as low as 4% for prompt repayment.",
      "Lowers the cost of borrowing and increases profitability.",
      "Encourages timely repayment of loans.",
      "Provides interest relief on restructured loans in case of natural calamities."
    ],
    eligibility: [
      "Farmers availing short-term crop loans up to ₹3 lakh through KCC.",
      "Farmers in animal husbandry and fisheries availing loans up to ₹2 lakh through KCC."
    ],
    applicationProcess: "No separate application is needed. The benefit is automatically applied by the lending institution to all eligible KCC loans.",
    requiredDocuments: ["No separate documents required beyond the KCC application."],
    website: "https://fasalrin.gov.in/",
    keywords: ["interest subvention on crop loan", "4% interest loan for farmers", "KCC interest rate", "prompt repayment incentive", "agricultural loan subsidy", "farm loan interest relief"]
  },
  {
    id: 9,
    title: "Dairy Entrepreneurship Development Scheme (DEDS)",
    objective: "To promote the establishment of modern dairy farms and generate self-employment in the unorganized dairy sector.",
    description: "A credit-linked capital subsidy scheme (now subsumed under NLM & AHIDF) that provided financial assistance for dairy-related activities, including setting up small dairy units, purchasing milking machines, and developing processing infrastructure.",
    benefits: [
      "Provided significant capital subsidy (25% to 33.33%) on project cost.",
      "Encouraged modern and scientific dairy farming practices.",
      "Generated self-employment opportunities in rural areas.",
      "Helped create dairy processing and cold chain infrastructure."
    ],
    eligibility: [
      "Farmers, individual entrepreneurs, companies.",
      "SHGs, dairy cooperative societies, and other groups."
    ],
    applicationProcess: "Beneficiaries submitted a project report to a financing bank for a loan. The bank then applied to NABARD for the subsidy. (Note: Scheme discontinued for new sanctions).",
    requiredDocuments: [
      "Project report",
      "Bank application form",
      "Identity and address proof",
      "Land ownership documents"
    ],
    website: "https://www.nabard.org/",
    keywords: ["dairy farm subsidy", "NABARD dairy loan", "DEDS scheme", "loan for buying cows", "milk processing subsidy", "dairy entrepreneurship scheme", "heifer calf rearing scheme"]
  },
  {
    id: 10,
    title: "Agriculture Infrastructure Fund (AIF)",
    objective: "To mobilize medium to long-term debt financing for investment in post-harvest management infrastructure and community farming assets.",
    description: "A financing facility of ₹1 lakh crore that provides a 3% interest subvention on loans up to ₹2 crore for creating and modernizing agricultural infrastructure like warehouses, cold storage, and processing units. It also offers credit guarantee coverage.",
    benefits: [
      "Provides access to affordable credit with a 3% interest subvention.",
      "Reduces lending risk for banks through credit guarantee coverage.",
      "Helps reduce post-harvest losses and enables better price realization.",
      "Promotes private investment and innovation in the agri value chain."
    ],
    eligibility: [
      "PACS, FPOs, SHGs, Marketing Cooperative Societies.",
      "Individual farmers, agri-entrepreneurs, and start-ups."
    ],
    applicationProcess: "Eligible entities can apply online through the AIF portal (agriinfra.dac.gov.in) by submitting a Detailed Project Report (DPR).",
    requiredDocuments: [
      "Detailed Project Report (DPR)",
      "KYC documents",
      "Land ownership or lease documents",
      "Bank account details"
    ],
    website: "https://agriinfra.dac.gov.in/",
    keywords: ["Agriculture Infrastructure Fund", "AIF scheme", "loan for warehouse", "cold storage subsidy", "post-harvest management loan", "agri infra fund apply online", "FPO infrastructure loan"]
  },
    {
    id: 11,
    title: "Gramin Bhandaran Yojana (Rural Godown Scheme)",
    objective: "To create scientific storage capacity in rural areas to prevent distress sales by farmers and reduce post-harvest losses.",
    description: "A capital investment subsidy scheme for the construction or renovation of rural godowns. It encourages private and cooperative investment by providing a back-ended capital subsidy linked to institutional credit. Godowns must meet scientific storage standards.",
    benefits: [
      "Provides capital subsidy of 15% to 33.33% of the project cost.",
      "Enables farmers to store produce and avoid selling at low prices during harvest.",
      "Facilitates access to pledge loans against warehouse receipts.",
      "Reduces storage losses through scientific warehousing."
    ],
    eligibility: [
      "Individuals, farmers, FPOs, SHGs.",
      "Partnership firms, companies, cooperatives, NGOs.",
      "APMCs and Marketing Boards."
    ],
    applicationProcess: "The entrepreneur submits a project proposal to a financing bank for a term loan. The bank, upon sanctioning the loan, applies to NABARD for the subsidy.",
    requiredDocuments: [
      "Project proposal/DPR",
      "Bank application form",
      "Land ownership/lease documents",
      "Identity and address proof"
    ],
    website: "https://dmi.gov.in/",
    keywords: ["rural godown scheme", "Gramin Bhandaran Yojana", "subsidy for warehouse construction", "NABARD warehouse loan", "pledge loan against crops", "scientific storage subsidy"]
  },
  {
    id: 12,
    title: "National Agriculture Market (e-NAM)",
    objective: "To create a unified national market for agricultural commodities by networking existing APMC mandis into a pan-India electronic trading portal.",
    description: "A virtual market platform that facilitates transparent online trading of agricultural produce. It allows farmers to showcase their produce to a larger number of buyers across the country, with provisions for quality assaying, online bidding, and direct e-payment.",
    benefits: [
      "Ensures better price discovery through transparent online auctions.",
      "Provides wider market access, connecting farmers to buyers across states.",
      "Facilitates direct and timely payments into farmers' bank accounts.",
      "Reduces information asymmetry by providing real-time price data."
    ],
    eligibility: [
      "Any farmer can register to sell produce.",
      "Traders, FPOs, and Commission Agents can register to participate.",
      "APMC mandis in states that have undertaken requisite reforms."
    ],
    applicationProcess: "Farmers can register on the e-NAM portal (enam.gov.in), through the mobile app, or at an e-NAM enabled mandi. Produce is assayed, and online bidding takes place, followed by direct payment.",
    requiredDocuments: [
      "Government-issued Identity Proof (Aadhaar)",
      "Bank account details",
      "Mobile number and email ID"
    ],
    website: "https://enam.gov.in/web/",
    keywords: ["eNAM registration", "online mandi", "national agriculture market", "sell crops online", "APMC online trading", "eNAM farmer registration", "commodity price live"]
  },
  {
    id: 13,
    title: "Agri-Clinics and Agri-Business Centres (ACABC) Scheme",
    objective: "To supplement public extension services and create gainful self-employment for unemployed agricultural graduates and diploma holders.",
    description: "Supports agricultural professionals in setting up ventures that provide expert advice (Agri-Clinics) and farm inputs/services (Agri-Business Centres). The scheme includes a 45-day free residential training and facilitates a credit-linked back-ended subsidy through NABARD.",
    benefits: [
      "Creates self-employment for agricultural professionals.",
      "Provides farmers with access to expert advice and modern services locally.",
      "Promotes the adoption of new technologies and best practices.",
      "Offers a credit-linked subsidy of 36% to 44% on the project cost."
    ],
    eligibility: [
      "Graduates or Diploma holders in agriculture and allied subjects.",
      "Biological Science graduates with a post-grad in agri-related subjects.",
      "Applicants aged between 18 and 60 years."
    ],
    applicationProcess: "Candidates apply online for the training program. After completion, they prepare a DPR, secure a bank loan, and the bank applies to NABARD for the subsidy.",
    requiredDocuments: [
      "Aadhaar Card",
      "Educational qualification certificates",
      "Training completion certificate",
      "Detailed Project Report (DPR)"
    ],
    website: "http://www.acabcmis.gov.in/",
    keywords: ["agri clinic scheme", "agribusiness centre loan", "ACABC training", "subsidy for agriculture graduates", "NABARD agri clinic", "how to start agri business"]
  },
  {
    id: 14,
    title: "Pradhan Mantri Kisan Samriddhi Kendras (PMKSK)",
    objective: "To convert retail fertilizer shops into one-stop shops that cater to a wide variety of needs of the farmers and provide agri-services.",
    description: "An initiative to convert existing retail fertilizer shops into model one-stop centers. These PMKSKs sell fertilizers, seeds, and pesticides, and also provide soil testing, information on government schemes, and custom hiring of farm equipment and drones.",
    benefits: [
      "Provides a single point of contact for multiple agricultural needs.",
      "Ensures access to quality inputs and services like soil testing at the village level.",
      "Creates awareness about government schemes and modern farming practices.",
      "Facilitates technology adoption through services like drone spraying."
    ],
    eligibility: [
      "Existing retail fertilizer shops (private and cooperative).",
      "Primary Agricultural Credit Societies (PACS)."
    ],
    applicationProcess: "The conversion is managed by the Department of Fertilizers in collaboration with fertilizer companies and state governments. Retailers are guided to upgrade their facilities.",
    requiredDocuments: [
      "Existing fertilizer retail license",
      "Shop's ownership/lease documents",
      "GST registration and other business documents"
    ],
    website: "https://pmkisan.gov.in/",
    keywords: ["PMKSK scheme", "Kisan Samriddhi Kendra", "one-stop shop for farmers", "fertilizer shop conversion", "soil testing near me", "drone service for farmers"]
  },
  {
    id: 15,
    title: "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)",
    objective: "To expand the cultivated area with assured irrigation, reduce wastage of water, and improve water use efficiency with the motto 'Har Khet Ko Paani'.",
    description: "An umbrella scheme that amalgamates various irrigation-related initiatives. Its components focus on completing major irrigation projects (AIBP), creating new water sources (HKKP), promoting micro-irrigation (PDMC), and watershed development.",
    benefits: [
      "Aims to provide assured irrigation, reducing dependence on monsoons.",
      "Promotes water conservation and improves water use efficiency.",
      "Integrates various water management efforts under a single framework.",
      "Enhances agricultural productivity and farmer income."
    ],
    eligibility: [
      "The scheme is implemented by State Governments.",
      "All farmers who own agricultural land are eligible to benefit from its interventions."
    ],
    applicationProcess: "Implemented through State Irrigation/Agriculture Departments. Farmers can apply for specific components like micro-irrigation through their respective state department's portals.",
    requiredDocuments: [
      "Proof of land ownership",
      "Aadhaar card",
      "Bank account details"
    ],
    website: "https://pmksy.gov.in/",
    keywords: ["PMKSY scheme", "irrigation subsidy", "Har Khet Ko Paani", "water for farm", "government irrigation scheme", "check dam construction subsidy"]
  },
    {
    id: 16,
    title: "Per Drop More Crop (PDMC)",
    objective: "To enhance water use efficiency at the farm level through the adoption of precision/micro-irrigation technologies like drip and sprinkler systems.",
    description: "A key component of PMKSY, PDMC provides financial assistance (subsidy) to farmers for installing drip, sprinkler, and rain gun irrigation systems. It aims to save water, reduce fertilizer consumption, and lower labor and energy costs.",
    benefits: [
      "Significantly reduces water consumption compared to flood irrigation.",
      "Leads to higher crop yields due to uniform water application.",
      "Lowers costs of electricity, fertilizers, and labor.",
      "Provides subsidies of 45% to 55% of the unit cost."
    ],
    eligibility: [
      "All categories of farmers who own agricultural land.",
      "Subsidy is limited to a total area of 5 hectares per beneficiary.",
      "Farmers must have a confirmed water source."
    ],
    applicationProcess: "Farmers apply through their State's Agriculture or Horticulture Department, often via a dedicated online portal. After verification and installation by an empanelled manufacturer, the subsidy is released via DBT.",
    requiredDocuments: [
      "Application form",
      "Aadhaar Card",
      "Proof of land ownership",
      "Bank account details",
      "Proof of water source"
    ],
    website: "https://pmksy.gov.in/microirrigation/index.aspx",
    keywords: ["per drop more crop", "drip irrigation subsidy", "sprinkler system subsidy", "micro irrigation scheme", "PMKSY drip irrigation", "subsidy for pipeline", "rain gun subsidy"]
  },
  {
    id: 17,
    title: "Sub-Mission on Agricultural Mechanization (SMAM)",
    objective: "To increase the reach of farm mechanization to small and marginal farmers and to promote Custom Hiring Centres (CHCs).",
    description: "Provides financial assistance in the form of subsidies for the procurement of various types of agricultural machinery. A major focus is on promoting CHCs and Farm Machinery Banks (FMBs) to make expensive machinery accessible to small farmers through rentals.",
    benefits: [
      "Provides subsidies of 40-50% on the cost of machinery.",
      "Promotes access to expensive machinery through subsidized CHCs.",
      "Reduces drudgery, labor costs, and improves farm operation efficiency.",
      "Creates rural entrepreneurship opportunities through CHCs."
    ],
    eligibility: [
      "All individual farmers are eligible for subsidies.",
      "Farmers, rural entrepreneurs, FPOs, and SHGs are eligible for assistance to establish CHCs."
    ],
    applicationProcess: "Farmers must register on the central Direct Benefit Transfer (DBT) in Agriculture Mechanization portal (agrimachinery.nic.in) and apply online for the desired machine.",
    requiredDocuments: [
      "Aadhaar card",
      "Record-of-right of land",
      "Copy of Bank Passbook",
      "Passport Size Photograph"
    ],
    website: "https://agrimachinery.nic.in/",
    keywords: ["tractor subsidy", "farm machinery subsidy", "SMAM scheme", "rotavator subsidy", "apply for thresher machine", "custom hiring centre scheme", "agricultural mechanization subsidy"]
  },
  {
    id: 18,
    title: "Kisan Drone Scheme (and Namo Drone Didi)",
    objective: "To promote the use of drones in agriculture for precision farming, reduce manual labor, and make drone services accessible.",
    description: "A component under SMAM that provides financial assistance for purchasing agricultural drones. It supports individuals, FPOs, and CHCs. The 'Namo Drone Didi' initiative specifically empowers women's SHGs by providing them with drones to offer rental services.",
    benefits: [
      "Enables precision spraying of inputs, reducing wastage.",
      "Saves significant time and labor costs.",
      "Improves crop monitoring with real-time data.",
      "Provides substantial subsidies (up to 75% for FPOs) on the cost of drones."
    ],
    eligibility: [
      "Individual farmers (50% subsidy for small/marginal, 40% for others).",
      "FPOs (up to 75% subsidy).",
      "CHCs set up by agri-graduates, FPOs, etc.",
      "Women's Self Help Groups (under Namo Drone Didi)."
    ],
    applicationProcess: "Register on the Agri Mechanization DBT portal (agrimachinery.nic.in) and fill out the drone subsidy application. The subsidy is disbursed via DBT after purchase and verification.",
    requiredDocuments: [
      "Aadhaar Card and PAN Card",
      "Landholding proof",
      "Bank Account Passbook",
      "Quotation from a DGCA-approved drone seller"
    ],
    website: "https://agrimachinery.nic.in/",
    keywords: ["kisan drone subsidy", "drone for agriculture price", "Namo Drone Didi scheme", "subsidy for drone spraying", "agriculture drone online apply", "FPO drone subsidy"]
  },
  {
    id: 19,
    title: "Mission Amrit Sarovar",
    objective: "To develop and rejuvenate at least 75 water bodies ('Amrit Sarovars') in each district to overcome water crises and enhance groundwater.",
    description: "A mission focused on constructing new and rejuvenating existing ponds and water bodies. It works in convergence with other schemes like MGNREGS and PMKSY and emphasizes community participation ('Jan Bhagidaari').",
    benefits: [
      "Increases availability of water for irrigation and other rural needs.",
      "Helps in recharging groundwater levels.",
      "Creates durable community assets.",
      "Generates local employment."
    ],
    eligibility: [
      "The scheme is implemented at the district/village level, not for individual beneficiaries."
    ],
    applicationProcess: "No application process for individuals. Gram Panchayats and local communities propose potential sites to the district administration.",
    requiredDocuments: ["Not applicable for individual farmers."],
    website: "https://water.ncog.gov.in/AmritSarovar/",
    keywords: ["Amrit Sarovar mission", "pond rejuvenation scheme", "water conservation scheme", "government scheme for water bodies", "check dam construction", "rainwater harvesting project"]
  },
  {
    id: 20,
    title: "Soil Health Card Scheme",
    objective: "To issue soil health cards to all farmers to provide information on the nutrient status of their soil and recommend appropriate dosages of nutrients.",
    description: "Provides every farmer with a printed report (Soil Health Card) detailing the status of their soil with respect to 12 parameters. Based on this analysis, the card provides crop-wise recommendations for fertilizers and amendments. Cards are issued every 2-3 years.",
    benefits: [
      "Promotes balanced and judicious use of fertilizers, reducing input costs.",
      "Improves soil health and fertility, leading to increased productivity.",
      "Empowers farmers with scientific information for informed decision-making.",
      "Reduces environmental pollution from excessive fertilizer use."
    ],
    eligibility: [
      "All farmers in the country are eligible to receive a Soil Health Card."
    ],
    applicationProcess: "A proactive government initiative where State Agriculture Department officials collect soil samples. Farmers generally do not need to apply but can approach their local agriculture office.",
    requiredDocuments: ["Generally none required, but proof of land ownership may be needed if a farmer initiates the request."],
    website: "https://soilhealth.dac.gov.in/",
    keywords: ["Soil Health Card", "soil testing for agriculture", "how to get soil health card", "mitti ki janch", "fertilizer recommendation", "soil nutrient information", "SHC scheme"]
  },
    {
    id: 21,
    title: "Paramparagat Krishi Vikas Yojana (PKVY)",
    objective: "To support and promote organic farming to produce agricultural products free from chemical and pesticide residues.",
    description: "Promotes organic farming through a cluster-based approach, where groups of 50+ farmers adopt organic cultivation over 50 acres. It provides end-to-end support, from production to certification (via PGS-India) and marketing, with financial assistance.",
    benefits: [
      "Provides financial assistance of ₹50,000 per hectare over three years.",
      "Reduces cultivation costs by promoting on-farm organic inputs.",
      "Facilitates certification and marketing to fetch premium prices.",
      "Improves soil fertility and promotes environmental conservation."
    ],
    eligibility: [
      "Farmers willing to take up organic farming in a cluster of at least 20 hectares.",
      "Each farmer should have a landholding of 0.4 to 2 hectares."
    ],
    applicationProcess: "Implemented by State Governments. Interested farmers form a cluster and approach their district/block agriculture office to get registered and receive assistance.",
    requiredDocuments: [
      "Land ownership documents",
      "Aadhaar card",
      "Bank account details"
    ],
    website: "https://pgsindia-ncof.gov.in/",
    keywords: ["organic farming scheme", "PKVY scheme", "jaivik kheti subsidy", "participatory guarantee system", "financial assistance for organic farming", "how to form farmer cluster for PKVY"]
  },
  {
    id: 22,
    title: "National Mission on Sustainable Agriculture (NMSA)",
    objective: "To make agriculture more productive, sustainable, and climate-resilient by promoting integrated farming systems.",
    description: "An umbrella mission under the National Action Plan on Climate Change that integrates schemes related to soil and water conservation, water use efficiency, and soil health management. Its major components include Rainfed Area Development (RAD) and On-Farm Water Management (OFWM).",
    benefits: [
      "Promotes a holistic, integrated farming approach to minimize risk.",
      "Enhances the conservation of natural resources like soil and water.",
      "Builds the capacity of farmers to adapt to climate change.",
      "Improves soil health and water use efficiency."
    ],
    eligibility: [
      "Implemented by State Governments.",
      "Individual farmers and farmer groups are the ultimate beneficiaries."
    ],
    applicationProcess: "State Governments prepare Annual Action Plans. Farmers can avail benefits by participating in the projects implemented by their State Agriculture Departments.",
    requiredDocuments: ["Varies by component but generally includes Aadhaar, land records, and bank details."],
    website: "https://nmsa.dac.gov.in/",
    keywords: ["NMSA scheme", "sustainable agriculture mission", "climate resilient agriculture", "integrated farming system scheme", "rainfed area development", "soil health management mission"]
  },
  {
    id: 23,
    title: "Bhartiya Prakritik Krishi Paddhati (BPKP)",
    objective: "To promote traditional indigenous farming practices, primarily Zero-Budget Natural Farming (ZBNF), to free farmers from dependence on external inputs.",
    description: "A sub-scheme of PKVY that emphasizes the exclusion of all synthetic chemical inputs. It promotes on-farm biomass recycling, mulching, and the use of cow dung-urine formulations (Jeevamrit, Beejamrit). Now being up-scaled into the National Mission on Natural Farming (NMNF).",
    benefits: [
      "Drastically reduces the cost of cultivation.",
      "Improves soil health, fertility, and microbial activity.",
      "Enhances water retention in the soil.",
      "Produces chemical-free and nutritious food."
    ],
    eligibility: [
      "Farmers willing to adopt natural farming practices in a cluster-based approach."
    ],
    applicationProcess: "Implemented by State Governments. Interested farmers form clusters and approach their local agriculture department to be included in the state's action plan.",
    requiredDocuments: ["Aadhaar card", "Land records", "Bank account details"],
    website: "https://naturalfarming.dac.gov.in/",
    keywords: ["BPKP scheme", "natural farming subsidy", "zero budget natural farming", "ZBNF scheme", "cow based farming", "Jeevamrit preparation"]
  },
  {
    id: 24,
    title: "National Mission on Natural Farming (NMNF)",
    objective: "To promote natural farming to reduce costs, popularize integrated agriculture-animal husbandry models, and create branding for natural products.",
    description: "A standalone scheme up-scaling BPKP. It aims to build a supportive ecosystem for farmers to transition to chemical-free, livestock-integrated farming, targeting 7.5 lakh hectares across 15,000 clusters and setting up 10,000 Bio-Input Resource Centres (BRCs).",
    benefits: [
      "Significantly lowers production costs and increases farmer income.",
      "Improves soil health and makes farming more climate-resilient.",
      "Produces safe, nutritious, chemical-free food.",
      "Creates a certification system and national brand for natural produce."
    ],
    eligibility: [
      "All farmers willing to adopt natural farming in a cluster-based approach."
    ],
    applicationProcess: "Interested farmers contact their Zila Parishad or District Agriculture Office. The State Agriculture Department then prepares an Annual Action Plan for implementation.",
    requiredDocuments: [
      "KYC documents (Aadhaar, etc.)",
      "Bank account details",
      "Land ownership documents"
    ],
    website: "https://naturalfarming.dac.gov.in/",
    keywords: ["National Mission on Natural Farming", "NMNF scheme", "natural farming government scheme", "chemical-free farming subsidy", "desi cow farming scheme", "bio-input resource centre"]
  },
  {
    id: 25,
    title: "National Project on Organic Farming (NPOF)",
    objective: "To promote organic farming through technical capacity building, provision of quality organic inputs, and dissemination of technology.",
    description: "A central scheme implemented by the National Centre for Organic and Natural Farming (NCONF). It focuses on training, promoting quality organic inputs like bio-fertilizers, and serving as a nodal quality control laboratory. It also supports the PGS-India certification system.",
    benefits: [
      "Provides training and capacity building on organic farming practices.",
      "Ensures the quality of organic and biological inputs in the market.",
      "Supports low-cost organic certification through the PGS-India system.",
      "Acts as a national knowledge repository for organic farming."
    ],
    eligibility: [
      "Primarily aimed at state governments and entrepreneurs.",
      "Farmers benefit indirectly through training and quality inputs."
    ],
    applicationProcess: "No direct application process for financial assistance for farmers. They can participate in training programs organized by NCONF.",
    requiredDocuments: ["Not applicable for direct farmer benefits."],
    website: "https://nconf.dac.gov.in/",
    keywords: ["NPOF scheme", "National Project on Organic Farming", "bio-fertilizer quality control", "organic farming training", "NCONF Ghaziabad", "PGS certification India"]
  },
    {
    id: 26,
    title: "PM Programme for Restoration, Awareness Generation, Nourishment, and Amelioration of Mother Earth (PM-PRANAM)",
    objective: "To incentivize States and Union Territories to reduce the use of chemical fertilizers and promote alternative and organic fertilizers.",
    description: "An innovative scheme with no separate budget, financed by savings from existing fertilizer subsidies. 50% of the subsidy saved by a state is given back as a grant, which can be used for asset creation for alternative fertilizers and to incentivize farmers.",
    benefits: [
      "Reduces the subsidy burden on the central government.",
      "Promotes sustainable agricultural practices and improves soil health.",
      "Encourages states to adopt and promote alternative nutrients.",
      "Provides financial resources to states for creating infrastructure."
    ],
    eligibility: [
      "Applicable to all States and Union Territories.",
      "Farmers, FPOs, and Panchayats are indirect beneficiaries of state grants."
    ],
    applicationProcess: "A government-to-government scheme. States that reduce chemical fertilizer consumption automatically become eligible. No direct application for farmers.",
    requiredDocuments: ["Not applicable for farmers."],
    website: "https://fert.nic.in/",
    keywords: ["PM PRANAM scheme", "reduce chemical fertilizer", "alternative fertilizer subsidy", "state incentive for organic farming", "balanced use of fertilizers"]
  },
  {
    id: 27,
    title: "Gobar Dhan Yojana",
    objective: "To support villages in safely managing cattle and agricultural waste and converting it into biogas, Compressed Bio-Gas (CBG), and organic manure.",
    description: "An umbrella initiative under the Swachh Bharat Mission that promotes waste-to-energy and waste-to-wealth projects. It supports the establishment of biogas/CBG plants at individual, community, and commercial levels to keep villages clean and increase rural incomes.",
    benefits: [
      "Provides clean and affordable cooking fuel (biogas).",
      "Produces high-quality organic manure, improving soil health.",
      "Creates income opportunities through the sale of biogas, CBG, or slurry.",
      "Improves village sanitation and hygiene."
    ],
    eligibility: [
      "Individual households, clusters of households, and communities.",
      "Entrepreneurs, Cooperatives, Gaushalas, and Dairies for commercial plants."
    ],
    applicationProcess: "Gram Panchayats identify beneficiaries for smaller projects. Entrepreneurs can register commercial projects on the GOBARdhan Unified Registration Portal.",
    requiredDocuments: [
      "Aadhaar Card (for individuals)",
      "Corporate documents (for commercial entities)",
      "Land documents",
      "Bank account details"
    ],
    website: "https://gobardhan.sbm.gov.in/",
    keywords: ["Gobar Dhan scheme", "biogas plant subsidy", "cattle dung to energy", "organic manure from cow dung", "CBG plant scheme", "waste to wealth scheme"]
  },
  {
    id: 28,
    title: "Rashtriya Gokul Mission (RGM)",
    objective: "To develop and conserve indigenous bovine breeds in a scientific and holistic manner to enhance milk production and productivity.",
    description: "A centrally funded scheme focused on the genetic upgradation of bovine population. It supports establishing 'Gokul Grams' (cattle centers), bull production programs, and implementing advanced reproductive technologies like IVF and sex-sorted semen.",
    benefits: [
      "Improves the genetic makeup of indigenous cattle, leading to higher milk yields.",
      "Increases the availability of high-genetic-merit bulls.",
      "Enhances access to Artificial Insemination (AI) services.",
      "Promotes the conservation of native bovine genetic resources."
    ],
    eligibility: [
      "Implemented through State Livestock Development Boards.",
      "Individual farmers, breeders, FPOs, and entrepreneurs can benefit from various components."
    ],
    applicationProcess: "Farmers avail benefits through state-level programs. Entrepreneurs may need to submit a DPR to the state agency for specific components.",
    requiredDocuments: ["Varies by component; generally includes identity proof, land documents, bank details, and a DPR for ventures."],
    website: "https://dahd.gov.in/schemes/programmes/rashtriya_gokul_mission",
    keywords: ["Rashtriya Gokul Mission", "RGM scheme", "indigenous cattle breed improvement", "Gokul Gram", "IVF for cows subsidy", "sex sorted semen scheme", "desi cow breeding"]
  },
  {
    id: 29,
    title: "National Livestock Mission (NLM)",
    objective: "To ensure quantitative and qualitative improvement in livestock production systems and enhance the livelihood of livestock keepers.",
    description: "Focuses on the development of poultry, sheep, goat, and piggery sectors, along with feed and fodder. Provides capital subsidies (up to 50%) to individuals, FPOs, and SHGs for establishing entrepreneurship projects in these sectors.",
    benefits: [
      "Provides up to 50% capital subsidy for setting up new enterprises.",
      "Promotes breed improvement in small ruminants, poultry, and pigs.",
      "Addresses the deficit in animal feed and fodder.",
      "Creates employment and entrepreneurship opportunities."
    ],
    eligibility: [
      "Individuals, SHGs, FPOs, Farmer Cooperative Societies, and Section 8 companies."
    ],
    applicationProcess: "Beneficiaries submit an application online through the NLM portal (nlm.udyamimitra.in), secure a bank loan, and get the proposal approved by the state and central departments for subsidy release.",
    requiredDocuments: [
      "Detailed Project Report (DPR)",
      "KYC documents (Aadhaar, PAN)",
      "Land documents",
      "Bank loan sanction letter"
    ],
    website: "https://nlm.udyamimitra.in/",
    keywords: ["National Livestock Mission", "NLM subsidy", "poultry farm loan subsidy", "goat farming scheme", "piggery scheme subsidy", "fodder development scheme", "animal husbandry entrepreneurship"]
  },
  {
    id: 30,
    title: "Pradhan Mantri Matsya Sampada Yojana (PMMSY)",
    objective: "To bring about a 'Blue Revolution' through sustainable and responsible development of the fisheries sector.",
    description: "A flagship scheme with an investment of ₹20,050 crore to address critical gaps in the fisheries value chain. It supports aquaculture development, mariculture, infrastructure (cold chain, fishing harbors), marketing, and welfare of fishers.",
    benefits: [
      "Provides financial assistance for various fisheries projects.",
      "Aims to enhance fish production to 22 million metric tons.",
      "Focuses on doubling the income of fishers and fish farmers.",
      "Aims to reduce post-harvest losses significantly."
    ],
    eligibility: [
      "Fishers, fish farmers, fish workers, and fish vendors.",
      "Fisheries Cooperatives, FPOs, SHGs.",
      "Private firms and entrepreneurs."
    ],
    applicationProcess: "Implemented by State/UT Fisheries Departments. Beneficiaries submit a DPR to the District Fisheries Officer for scrutiny and approval.",
    requiredDocuments: [
      "Detailed Project Report (DPR)",
      "Identity and address proof",
      "Land/water body ownership or lease documents",
      "Bank account details"
    ],
    website: "https://pmmsy.dof.gov.in/",
    keywords: ["PMMSY scheme", "fisheries subsidy", "fish farming loan", "aquaculture scheme", "blue revolution scheme", "cold storage for fish subsidy", "fishing boat subsidy"]
  },
    {
    id: 31,
    title: "Animal Husbandry Infrastructure Development Fund (AHIDF)",
    objective: "To incentivize investments to establish dairy processing, meat processing, and animal feed plants.",
    description: "A central sector scheme with a corpus of ₹15,000 crore that facilitates credit for establishing and strengthening animal husbandry infrastructure. It provides a 3% interest subvention on loans (up to 90% of the project cost) for eligible projects.",
    benefits: [
      "Provides a 3% interest subvention, making capital more affordable.",
      "Encourages private sector investment in animal husbandry.",
      "Helps increase milk and meat processing capacity.",
      "Ensures better availability of quality animal feed."
    ],
    eligibility: [
      "Farmer Producer Organizations (FPOs)",
      "Private companies and individual entrepreneurs",
      "Section 8 companies",
      "Micro, Small, and Medium Enterprises (MSMEs)"
    ],
    applicationProcess: "The entity prepares a DPR, applies for a loan from a bank, and submits the application online through the Udyami Mitra Portal. The department then approves the project for interest subvention.",
    requiredDocuments: [
      "Detailed Project Report (DPR)",
      "KYC documents",
      "Land documents",
      "Bank loan sanction letter"
    ],
    website: "https://portal.udyamimitra.in/",
    keywords: ["AHIDF scheme", "animal husbandry loan", "dairy processing plant subsidy", "meat processing subsidy", "animal feed plant loan", "interest subvention for dairy"]
  },
  {
    id: 32,
    title: "Dairy Processing and Infrastructure Development Fund (DIDF)",
    objective: "To modernize the milk processing and chilling infrastructure and create additional capacity for dairy cooperatives.",
    description: "A fund established with NABARD to provide concessional loans to dairy cooperatives. It aims to build an efficient milk procurement system, set up chilling infrastructure, and modernize processing facilities for value-added dairy products.",
    benefits: [
      "Provides loans at a concessional interest rate with subvention.",
      "Helps in creating and modernizing dairy processing infrastructure.",
      "Builds an efficient milk procurement system with village-level chilling.",
      "Helps dairy cooperatives add more value to their products."
    ],
    eligibility: [
      "Profitable Milk Unions, State Dairy Federations, Multi-state Milk Cooperatives, and Milk Producer Companies."
    ],
    applicationProcess: "The eligible cooperative prepares a DPR and submits it to the National Dairy Development Board (NDDB). After appraisal by NDDB and NABARD, the loan is sanctioned.",
    requiredDocuments: [
      "Detailed Project Report (DPR)",
      "Financial statements of the cooperative",
      "Board resolution to undertake the project"
    ],
    website: "https://dahd.nic.in/",
    keywords: ["DIDF scheme", "dairy infrastructure fund", "loan for milk chilling plant", "NABARD dairy processing loan", "dairy cooperative loan", "milk union infrastructure"]
  },
  {
    id: 33,
    title: "Fisheries and Aquaculture Infrastructure Development Fund (FIDF)",
    objective: "To create and modernize fisheries infrastructure facilities in both marine and inland fisheries sectors.",
    description: "Provides concessional finance to eligible entities for developing fisheries infrastructure like fishing harbors, ice plants, cold storage, and fish feed mills. The Department of Fisheries provides an interest subvention of up to 3% on these loans.",
    benefits: [
      "Provides concessional finance with a 3% interest subvention.",
      "Helps bridge the infrastructure gap in the fisheries sector.",
      "Promotes the creation of modern post-harvest facilities.",
      "Aims to boost fish production sustainably."
    ],
    eligibility: [
      "State Governments/UTs",
      "State-owned corporations",
      "Fisheries Cooperative Federations",
      "Private companies, entrepreneurs, and FPOs"
    ],
    applicationProcess: "Eligible entities prepare a DPR and submit the application online through the FIDF portal or offline. Proposals are appraised by NFDB and lending institutions.",
    requiredDocuments: [
      "Detailed Project Report (DPR)",
      "KYC documents",
      "Land and project-related clearances"
    ],
    website: "https://dof.gov.in/fidf",
    keywords: ["FIDF scheme", "fisheries infrastructure loan", "fishing harbour development", "cold storage for fish subsidy", "aquaculture infrastructure fund", "NABARD fisheries loan"]
  },
  {
    id: 34,
    title: "Rashtriya Krishi Vikas Yojana (RKVY)",
    objective: "To incentivize states to increase public investment in agriculture and allied sectors for holistic growth.",
    description: "A state plan scheme providing states with flexibility and autonomy to plan and execute agricultural programs based on their priorities. States receive funds by maintaining or increasing their expenditure on agriculture. It has been revamped as RKVY-RAFTAAR to make farming more remunerative.",
    benefits: [
      "Provides flexibility to states to fund projects based on local needs.",
      "Encourages increased state investment in agriculture.",
      "Supports a wide range of activities from infrastructure to innovation.",
      "Promotes agri-entrepreneurship."
    ],
    eligibility: [
      "Implemented by State Governments.",
      "Farmers, FPOs, and entrepreneurs can be beneficiaries of state-approved projects."
    ],
    applicationProcess: "State Agriculture Departments prepare plans and projects are approved by a State Level Sanctioning Committee. Farmers access benefits by participating in these projects.",
    requiredDocuments: ["Not directly applicable to farmers; project proposals are submitted by implementing agencies."],
    website: "https://agriwelfare.gov.in/en/Rashtriya Div",
    keywords: ["RKVY scheme", "Rashtriya Krishi Vikas Yojana", "RKVY RAFTAAR", "state agriculture plan", "agriculture investment scheme", "agri startup RKVY"]
  },
  {
    id: 35,
    title: "Green Revolution - Krishonnati Yojana",
    objective: "To develop the agriculture and allied sectors in a holistic and scientific manner to increase farmers' income.",
    description: "A centrally sponsored umbrella scheme that has integrated 11 different schemes and missions, including MIDH, NFSM, NMSA, and SMAM. It provides a comprehensive and structured approach to agricultural development, covering horticulture, food security, mechanization, and more.",
    benefits: [
      "Provides a holistic development framework by converging multiple schemes.",
      "Ensures better monitoring and coordination of agricultural initiatives.",
      "Aims to double farmers' income through a multi-pronged strategy.",
      "Each sub-scheme provides specific benefits in its focus area."
    ],
    eligibility: [
      "Varies according to the specific sub-scheme under the Krishonnati Yojana umbrella."
    ],
    applicationProcess: "Not centralized. Farmers must apply for the individual sub-schemes (e.g., MIDH, SMAM) through their respective procedures and portals.",
    requiredDocuments: ["Depends on the specific sub-scheme being applied for."],
    website: "N/A (Refer to individual sub-scheme websites)",
    keywords: ["Krishonnati Yojana", "Green Revolution scheme", "umbrella scheme for agriculture", "MIDH", "NFSM", "NMSA", "SMAM"]
  },
    {
    id: 36,
    title: "National Food Security Mission (NFSM)",
    objective: "To increase the production of rice, wheat, pulses, and coarse cereals through area expansion and productivity enhancement.",
    description: "A centrally sponsored scheme focusing on bridging the yield gap in high-potential districts. It provides support through cluster demonstrations, distribution of high-yielding seeds, integrated nutrient management (INM), and improved farm machinery.",
    benefits: [
      "Provides incentives and subsidies for adopting improved technologies.",
      "Increases access to high-yielding and hybrid seeds.",
      "Promotes sustainable practices that restore soil fertility.",
      "Enhances farm-level economy and national food security."
    ],
    eligibility: [
      "All farmers in the identified districts across 28 states and 2 UTs."
    ],
    applicationProcess: "Implemented by State Agriculture Departments. Beneficiaries are selected at the village level. Farmers can contact their local agriculture office or KVK.",
    requiredDocuments: [
      "Aadhaar number",
      "Bank account details",
      "Land records"
    ],
    website: "https://www.nfsm.gov.in/",
    keywords: ["NFSM scheme", "National Food Security Mission", "rice production scheme", "wheat productivity", "pulses subsidy", "high yielding seeds subsidy", "cluster demonstration"]
  },
  {
    id: 37,
    title: "National Mission on Edible Oils - Oil Palm (NMEO-OP)",
    objective: "To enhance edible oil production by increasing the area under oil palm cultivation and reducing India's import burden.",
    description: "A centrally sponsored scheme with a special focus on the North-Eastern region. It provides a price assurance mechanism (Viability Price) to protect farmers from price volatility and offers substantial assistance for planting material and inter-cropping.",
    benefits: [
      "Provides price assurance, ensuring remunerative and stable prices.",
      "Offers significant financial assistance for planting material.",
      "Promotes inter-cropping to provide income during the gestation period.",
      "Aims to make India self-reliant in edible oil."
    ],
    eligibility: [
      "Farmers in the identified potential states and districts for oil palm cultivation."
    ],
    applicationProcess: "Implemented through State Departments of Agriculture/Horticulture. Interested farmers contact their district office to register and receive guidance.",
    requiredDocuments: [
      "Application form",
      "Aadhaar card",
      "Land ownership documents",
      "Bank account details"
    ],
    website: "https://nmeo.dac.gov.in/",
    keywords: ["oil palm cultivation subsidy", "NMEO-OP scheme", "edible oil mission", "palm oil farming India", "price assurance for oil palm", "subsidy for planting material"]
  },
  {
    id: 38,
    title: "National Bamboo Mission (NBM)",
    objective: "To promote the holistic growth of the bamboo sector by increasing the area under bamboo cultivation and marketing.",
    description: "A restructured mission to develop the complete value chain of the bamboo sector. It supports cultivation on non-forest lands, establishment of nurseries, and setting up of processing and value addition units, with financial assistance provided as a credit-linked back-ended subsidy.",
    benefits: [
      "Provides financial assistance for bamboo plantations and processing units.",
      "Supplements farm income by promoting bamboo as a complementary crop.",
      "Creates rural employment opportunities.",
      "Develops the market for various bamboo products."
    ],
    eligibility: [
      "Farmers, FPOs, SHGs, entrepreneurs, and private companies."
    ],
    applicationProcess: "Implemented by State Bamboo Missions. Interested beneficiaries apply to their respective State Bamboo Mission, often through district offices or online portals.",
    requiredDocuments: [
      "Application form",
      "Identity and address proof",
      "Land ownership/lease documents",
      "DPR for entrepreneurial projects"
    ],
    website: "https://nbm.dac.gov.in/",
    keywords: ["National Bamboo Mission", "bamboo plantation subsidy", "NBM scheme", "loan for bamboo processing unit", "bamboo farming scheme", "quality bamboo planting material"]
  },
  {
    id: 39,
    title: "National Beekeeping and Honey Mission (NBHM)",
    objective: "To achieve a 'Sweet Revolution' by promoting scientific beekeeping for income generation and enhancing crop productivity through pollination.",
    description: "A central sector scheme implemented through the National Bee Board (NBB). It has three Mini Missions focusing on pollination, post-harvest management, and research. It provides financial assistance for setting up beekeeping infrastructure and honey processing units.",
    benefits: [
      "Provides supplementary income for farmers.",
      "Enhances yield and quality of crops through improved pollination.",
      "Promotes production of high-value beehive products.",
      "Provides financial assistance for equipment, training, and processing units."
    ],
    eligibility: [
      "Individual farmers, beekeepers, and entrepreneurs.",
      "SHGs, FPOs, and Beekeepers' Cooperatives."
    ],
    applicationProcess: "Proposals are submitted to the National Bee Board (NBB) through state implementing agencies. A Detailed Project Report (DPR) is required for approval.",
    requiredDocuments: [
      "Detailed Project Report (DPR)",
      "Application form",
      "Identity and address proof",
      "Land documents"
    ],
    website: "https://nbhm.gov.in/",
    keywords: ["honey mission scheme", "beekeeping subsidy", "NBHM online apply", "loan for honey processing unit", "sweet revolution scheme", "scientific beekeeping training"]
  },
  {
    id: 40,
    title: "Mission for Integrated Development of Horticulture (MIDH)",
    objective: "To promote the holistic growth of the horticulture sector (fruits, vegetables, spices, etc.) to enhance production and farmer income.",
    description: "A centrally sponsored scheme that subsumes missions like the National Horticulture Mission (NHM). It supports the entire horticulture value chain, from planting material to post-harvest management and marketing, encouraging modern technologies like micro-irrigation and greenhouses.",
    benefits: [
      "Provides financial assistance for establishing new orchards and farms.",
      "Offers subsidies for infrastructure like nurseries, greenhouses, and cold storages.",
      "Promotes high-value horticulture, increasing farmer income.",
      "Supports skill development and capacity building."
    ],
    eligibility: [
      "Individual farmers, groups of farmers, FPOs, SHGs.",
      "Entrepreneurs, private companies, cooperatives."
    ],
    applicationProcess: "Implemented by State Horticulture Missions (SHMs). Applicants submit a proposal to their District Horticulture Office. Many states use the HortNet online portal.",
    requiredDocuments: [
      "Application form",
      "Aadhaar card and photograph",
      "Land records (RoR)",
      "DPR for larger projects"
    ],
    website: "https://midh.gov.in/",
    keywords: ["horticulture mission subsidy", "MIDH scheme", "national horticulture mission", "greenhouse subsidy", "fruit orchard scheme", "cold storage subsidy horticulture", "NHM online apply"]
  },
  {
    id: 41,
    title: "Rainfed Area Development Programme (RADP)",
    objective: "To improve the quality of life of farmers in rainfed areas by maximizing farm returns through appropriate Integrated Farming Systems (IFS).",
    description: "A component of NMSA that focuses on developing rainfed areas in a 'watershed plus framework'. It promotes integrating crops, horticulture, livestock, and fishery to enhance productivity and minimize climate-related risks, providing financial assistance for adoption.",
    benefits: [
      "Provides financial assistance up to ₹30,000 per family for adopting IFS.",
      "Reduces the risk of crop failure by diversifying farm activities.",
      "Enhances productivity and income in resource-scarce rainfed regions.",
      "Promotes conservation of soil and moisture."
    ],
    eligibility: [
      "All farmers in identified rainfed areas, with priority for small and marginal farmers."
    ],
    applicationProcess: "Implemented by State Agriculture Departments. Beneficiaries are selected at the village/cluster level. Farmers should contact their local agriculture office.",
    requiredDocuments: [
      "Aadhaar Number",
      "Land Documents",
      "Bank Details"
    ],
    website: "https://nmsa.dac.gov.in/",
    keywords: ["rainfed farming scheme", "RADP scheme", "integrated farming system subsidy", "NMSA rainfed development", "dryland farming support", "livestock integration subsidy"]
  },
  {
    id: 42,
    title: "Formation and Promotion of 10,000 Farmer Producer Organizations (FPOs)",
    objective: "To provide a supportive ecosystem to form and promote 10,000 new FPOs, enabling farmers to enhance productivity and achieve sustainability through collective action.",
    description: "A Central Sector Scheme to collectivize small and marginal farmers into FPOs (farmer-owned companies or cooperatives). It provides financial support and handholding for up to five years to help them achieve economies of scale in input procurement, production, and marketing.",
    benefits: [
      "Enables farmers to achieve economies of scale.",
      "Strengthens their bargaining power in the market.",
      "Improves access to finance, technology, and quality inputs.",
      "Provides professional management support for the initial years."
    ],
    eligibility: [
      "Groups of farmers, particularly small and marginal farmers, can form an FPO."
    ],
    applicationProcess: "Implementing Agencies (IAs) like SFAC, NCDC, and NABARD are responsible for forming and promoting FPOs. Farmers can approach these agencies or their cluster-based business organizations.",
    requiredDocuments: ["Varies by Implementing Agency; includes farmer details, land records, and registration documents for the FPO."],
    website: "https://enam.gov.in/web/fpo/fpo-list",
    keywords: ["FPO scheme", "10000 FPO scheme", "how to form an FPO", "farmer producer organization subsidy", "collective farming", "SFAC FPO registration", "NABARD FPO"]
  }
];