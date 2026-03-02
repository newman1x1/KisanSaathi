"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle2, Leaf, Clock, AlertCircle, Sparkles, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface AnalysisReportProps {
  report: string
}

// Helper component for detail cards
function DetailCard({ label, english, local, color }: { label: string; english: string; local: string; color: string }) {
  const colorClasses = {
    green: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-300",
    orange: "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 hover:border-orange-300",
    red: "bg-gradient-to-br from-red-50 to-rose-50 border-red-200 hover:border-red-300",
    blue: "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:border-blue-300",
    purple: "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:border-purple-300",
  }

  const labelColorClasses = {
    green: "text-green-700",
    orange: "text-orange-700",
    red: "text-red-700",
    blue: "text-blue-700",
    purple: "text-purple-700",
  }

  return (
    <div className={`p-5 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
      <p className={`text-sm font-semibold mb-3 uppercase tracking-wide ${labelColorClasses[color as keyof typeof labelColorClasses]}`}>
        {label}
      </p>
      <p className="text-lg text-gray-900 font-medium leading-relaxed mb-2">{english}</p>
      {local && <p className="text-base text-gray-700 font-medium leading-relaxed">{local}</p>}
    </div>
  )
}

// Helper component for quick info cards
function QuickInfoCard({ icon, title, color, data }: { icon: React.ReactNode; title: string; color: string; data: Record<string, { english: string; local: string }> }) {
  const colorClasses = {
    green: "bg-gradient-to-br from-green-500 to-emerald-600",
    orange: "bg-gradient-to-br from-orange-500 to-amber-600",
    red: "bg-gradient-to-br from-red-500 to-rose-600",
    blue: "bg-gradient-to-br from-blue-500 to-cyan-600",
  }

  const bgColorClasses = {
    green: "bg-gradient-to-br from-green-50 to-emerald-50/50",
    orange: "bg-gradient-to-br from-orange-50 to-amber-50/50",
    red: "bg-gradient-to-br from-red-50 to-rose-50/50",
    blue: "bg-gradient-to-br from-blue-50 to-cyan-50/50",
  }

  const firstEntry = Object.entries(data)[0]
  
  return (
    <div className={`p-5 rounded-xl border-2 border-gray-200 hover:shadow-lg transition-all duration-300 ${bgColorClasses[color as keyof typeof bgColorClasses]}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} text-white shadow-md`}>
          {icon}
        </div>
        <h3 className="font-bold text-gray-900">{title}</h3>
      </div>
      {firstEntry && (
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{firstEntry[0]}</p>
          <p className="text-base text-gray-900 font-medium">{firstEntry[1].english}</p>
        </div>
      )}
    </div>
  )
}

export function AnalysisReport({ report }: AnalysisReportProps) {
  const parseReport = (text: string) => {
    const sections: Record<string, string> = {}

    // Try to split by markdown headers (##)
    const headerPattern = /##\s+([^\n]+)/g
    const matches = [...text.matchAll(headerPattern)]

    if (matches.length === 0) {
      // Fallback: return raw text if no structured format found
      console.log("[v0] No structured format found, using raw display")
      return null
    }

    for (let i = 0; i < matches.length; i++) {
      const sectionTitle = matches[i][1].trim()
      const startIndex = matches[i].index! + matches[i][0].length
      const endIndex = i < matches.length - 1 ? matches[i + 1].index : text.length
      const content = text.substring(startIndex, endIndex).trim()
      sections[sectionTitle] = content
    }

    console.log("[v0] Parsed sections:", Object.keys(sections))
    return sections
  }

  const sections = parseReport(report)

  if (!sections) {
    // If structured parsing fails, show the raw report with enhanced formatting
    return (
      <Card className="border-none shadow-xl bg-gradient-to-br from-white to-green-50/30">
        <CardHeader className="border-b bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                AI Analysis Report
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Comprehensive crop health assessment</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="prose prose-lg max-w-none prose-headings:text-green-900 prose-strong:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed">
            <ReactMarkdown>{report}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    )
  }

  const extractTableData = (content: string) => {
    const rows: Record<string, { english: string; local: string }> = {}
    const lines = content.split("\n").filter((l) => l.trim())

    for (const line of lines) {
      if (line.includes("|") && !line.includes("Feature") && !line.includes(":---")) {
        const parts = line.split("|").map((p) => p.trim())
        if (parts.length >= 4) {
          rows[parts[1]] = {
            english: parts[2],
            local: parts[3],
          }
        }
      }
    }

    return rows
  }

  const findSection = (keyword: string) => {
    return Object.keys(sections).find((key) => key.toUpperCase().includes(keyword.toUpperCase()))
  }

  const getSeverityColor = (severity: string) => {
    const lower = severity.toLowerCase()
    if (
      lower.includes("severe") ||
      lower.includes("गंभीर") ||
      lower.includes("ਗੰਭੀਰ") ||
      lower.includes("गंभीर") ||
      lower.includes("తీవ్రమైన")
    )
      return "destructive"
    if (
      lower.includes("moderate") ||
      lower.includes("मध्यम") ||
      lower.includes("ਮੱਧਮ") ||
      lower.includes("मध्यम") ||
      lower.includes("మధ్యస్థ")
    )
      return "default"
    return "secondary"
  }

  const getConfidenceColor = (confidence: string) => {
    const lower = confidence.toLowerCase()
    if (
      lower.includes("high") ||
      lower.includes("95") ||
      lower.includes("उच्च") ||
      lower.includes("ਉੱਚ") ||
      lower.includes("उच्च") ||
      lower.includes("అధిక")
    )
      return "default"
    if (
      lower.includes("medium") ||
      lower.includes("मध्यम") ||
      lower.includes("ਮੱਧਮ") ||
      lower.includes("मध्यम") ||
      lower.includes("మధ్యస్థ")
    )
      return "secondary"
    return "outline"
  }

  const identificationKey = findSection("IDENTIFICATION")
  const symptomsKey = findSection("SYMPTOMS")
  const diagnosisKey = findSection("DIAGNOSIS")
  const treatmentKey = findSection("TREATMENT")
  const notesKey = findSection("ADDITIONAL")

  const extractTreatments = (content: string) => {
    const lines = content.split("\n").filter((line) => line.trim())
    const treatments: Array<{ title: string; english: string; local: string }> = []
    let currentTreatment: { title: string; english: string; local: string } = {
      title: "",
      english: "",
      local: "",
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      if (/^\d+\.\s*\*\*/.test(line)) {
        if (currentTreatment.title) {
          treatments.push({ ...currentTreatment })
        }
        const titleMatch = line.match(/^\d+\.\s*\*\*([^*]+)\*\*/)
        currentTreatment = {
          title: titleMatch
            ? titleMatch[1].trim()
            : line.replace(/^\d+\.\s*\*\*/, "").replace(/\*\*/g, "").trim(),
          english: "",
          local: "",
        }
      } else if (/[-*]*\s*english:/i.test(line)) {
        currentTreatment.english = line.replace(/[-*]*\s*english:\s*/i, "").trim()
      } else if (/[-*]*\s*(hindi|punjabi|marathi|telugu|हिंदी|ਪੰਜਾਬੀ|मराठी|తెలుగు):/i.test(line)) {
        currentTreatment.local = line
          .replace(/[-*]*\s*(hindi|punjabi|marathi|telugu|हिंदी|ਪੰਜਾਬੀ|मराठी|తెలుగు):\s*/i, "")
          .trim()
      } else if (currentTreatment.title && !currentTreatment.english && !line.includes(":") && line.length > 10) {
        currentTreatment.english = line
      }
    }

    if (currentTreatment.title) {
      treatments.push(currentTreatment)
    }

    // Fallback treatments
    if (treatments.length === 0) {
      treatments.push(
        {
          title: "Immediate Actions",
          english: "Remove affected plant parts and isolate the crop to prevent spread. Apply immediate protective measures.",
          local: "",
        },
        {
          title: "Treatment Application",
          english: "Apply appropriate fungicide or pesticide based on the identified issue. Follow recommended dosage.",
          local: "",
        },
        {
          title: "Organic Treatment",
          english: "Use neem oil spray (5-10ml per liter of water) or organic compost to improve plant health.",
          local: "",
        },
        {
          title: "Monitoring & Prevention",
          english: "Monitor crop progress daily and implement preventive measures like proper drainage.",
          local: "",
        }
      )
    }

    return treatments
  }

  return (
    <Card className="border-none shadow-2xl bg-gradient-to-br from-white via-green-50/20 to-emerald-50/30">
      <CardHeader className="border-b bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 bg-clip-text text-transparent">
              AI Analysis Report
            </CardTitle>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Comprehensive crop health assessment and expert recommendations
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs defaultValue="overview" className="w-full">
          <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
            <TabsList className="w-full h-auto p-2 bg-transparent justify-start overflow-x-auto flex-nowrap">
              <TabsTrigger 
                value="overview" 
                className="gap-2 px-4 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-100 data-[state=active]:to-emerald-100 data-[state=active]:text-green-700 data-[state=active]:shadow-sm"
              >
                <Sparkles className="h-4 w-4" />
                <span className="font-semibold">Overview</span>
              </TabsTrigger>
              {identificationKey && sections[identificationKey] && (
                <TabsTrigger 
                  value="identification" 
                  className="gap-2 px-4 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-100 data-[state=active]:to-emerald-100 data-[state=active]:text-green-700 data-[state=active]:shadow-sm"
                >
                  <Leaf className="h-4 w-4" />
                  <span className="font-semibold">Identification</span>
                </TabsTrigger>
              )}
              {symptomsKey && sections[symptomsKey] && (
                <TabsTrigger 
                  value="symptoms" 
                  className="gap-2 px-4 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-100 data-[state=active]:to-amber-100 data-[state=active]:text-orange-700 data-[state=active]:shadow-sm"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-semibold">Symptoms</span>
                </TabsTrigger>
              )}
              {diagnosisKey && sections[diagnosisKey] && (
                <TabsTrigger 
                  value="diagnosis" 
                  className="gap-2 px-4 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-100 data-[state=active]:to-rose-100 data-[state=active]:text-red-700 data-[state=active]:shadow-sm"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-semibold">Diagnosis</span>
                </TabsTrigger>
              )}
              {(treatmentKey && sections[treatmentKey]) || !treatmentKey ? (
                <TabsTrigger 
                  value="treatment" 
                  className="gap-2 px-4 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-100 data-[state=active]:to-cyan-100 data-[state=active]:text-blue-700 data-[state=active]:shadow-sm"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span className="font-semibold">Treatment</span>
                </TabsTrigger>
              ) : null}
              {notesKey && sections[notesKey] && (
                <TabsTrigger 
                  value="notes" 
                  className="gap-2 px-4 py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-100 data-[state=active]:to-pink-100 data-[state=active]:text-purple-700 data-[state=active]:shadow-sm"
                >
                  <Clock className="h-4 w-4" />
                  <span className="font-semibold">Notes</span>
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="p-6 md:p-8 space-y-6 m-0">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Summary</h2>
              <p className="text-gray-600">Quick overview of your crop's condition and key findings</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {identificationKey && sections[identificationKey] && (
                <QuickInfoCard
                  icon={<Leaf className="h-5 w-5" />}
                  title="Crop Identified"
                  color="green"
                  data={extractTableData(sections[identificationKey])}
                />
              )}
              {symptomsKey && sections[symptomsKey] && (
                <QuickInfoCard
                  icon={<AlertTriangle className="h-5 w-5" />}
                  title="Symptoms"
                  color="orange"
                  data={extractTableData(sections[symptomsKey])}
                />
              )}
              {diagnosisKey && sections[diagnosisKey] && (
                <QuickInfoCard
                  icon={<AlertCircle className="h-5 w-5" />}
                  title="Diagnosis"
                  color="red"
                  data={extractTableData(sections[diagnosisKey])}
                />
              )}
            </div>
            
            {(treatmentKey && sections[treatmentKey]) || !treatmentKey ? (
              <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <ShieldCheck className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-blue-900">Treatment Available</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Detailed treatment recommendations and action plans are available. Switch to the Treatment tab to view step-by-step guidance.
                </p>
              </div>
            ) : null}
          </TabsContent>

          {/* Identification Tab */}
          {identificationKey && sections[identificationKey] && (
            <TabsContent value="identification" className="p-6 md:p-8 space-y-6 m-0">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <Leaf className="h-7 w-7 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Crop Identification</h2>
                </div>
                <p className="text-gray-600">Detailed information about the identified crop</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(extractTableData(sections[identificationKey])).map(([key, value]) => (
                  <DetailCard key={key} label={key} english={value.english} local={value.local} color="green" />
                ))}
              </div>
            </TabsContent>
          )}

          {/* Symptoms Tab */}
          {symptomsKey && sections[symptomsKey] && (
            <TabsContent value="symptoms" className="p-6 md:p-8 space-y-6 m-0">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <AlertTriangle className="h-7 w-7 text-orange-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Symptoms Observed</h2>
                  {(() => {
                    const severityEntry = Object.entries(extractTableData(sections[symptomsKey])).find(([key]) => 
                      key.toLowerCase().includes("severity")
                    )
                    return severityEntry && (
                      <Badge variant={getSeverityColor(severityEntry[1].english)} className="text-sm px-3 py-1">
                        {severityEntry[1].english}
                      </Badge>
                    )
                  })()}
                </div>
                <p className="text-gray-600">Visual and physical indicators detected in your crop</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(extractTableData(sections[symptomsKey]))
                  .filter(([key]) => !key.toLowerCase().includes("severity"))
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="p-5 rounded-xl border-2 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-lg"
                    >
                      <p className="text-sm font-semibold uppercase tracking-wide text-orange-700 mb-3">{key}</p>
                      <p className="text-lg text-gray-900 font-medium leading-relaxed mb-2">{value.english}</p>
                      {value.local && <p className="text-base text-gray-700 font-medium leading-relaxed">{value.local}</p>}
                    </div>
                  ))}
              </div>
            </TabsContent>
          )}

          {/* Diagnosis Tab */}
          {diagnosisKey && sections[diagnosisKey] && (
            <TabsContent value="diagnosis" className="p-6 md:p-8 space-y-6 m-0">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <AlertCircle className="h-7 w-7 text-red-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Diagnosis</h2>
                  {(() => {
                    const confidenceEntry = Object.entries(extractTableData(sections[diagnosisKey])).find(([key]) => 
                      key.toLowerCase().includes("confidence")
                    )
                    return confidenceEntry && (
                      <Badge variant={getConfidenceColor(confidenceEntry[1].english)} className="text-sm px-3 py-1">
                        {confidenceEntry[1].english}
                      </Badge>
                    )
                  })()}
                </div>
                <p className="text-gray-600">Professional assessment of your crop's condition</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(extractTableData(sections[diagnosisKey]))
                  .filter(([key]) => !key.toLowerCase().includes("confidence"))
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="p-5 rounded-xl border-2 bg-gradient-to-br from-red-50 to-rose-50 border-red-200 hover:border-red-300 transition-all duration-300 hover:shadow-lg"
                    >
                      <p className="text-sm font-semibold uppercase tracking-wide text-red-700 mb-3">{key}</p>
                      <p className="text-lg text-gray-900 font-bold leading-relaxed mb-2">{value.english}</p>
                      {value.local && <p className="text-base text-gray-700 font-medium leading-relaxed">{value.local}</p>}
                    </div>
                  ))}
              </div>
            </TabsContent>
          )}

          {/* Treatment Tab */}
          {(treatmentKey && sections[treatmentKey]) || !treatmentKey ? (
            <TabsContent value="treatment" className="p-6 md:p-8 space-y-6 m-0">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <ShieldCheck className="h-7 w-7 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Treatment Recommendations</h2>
                </div>
                <p className="text-gray-600">Step-by-step action plan to restore crop health</p>
              </div>

              <div className="space-y-5">
                {extractTreatments(treatmentKey ? sections[treatmentKey] : report).map((treatment, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-blue-900 mb-3">{treatment.title}</h4>
                        {treatment.english && (
                          <p className="text-gray-900 text-base leading-relaxed mb-3">{treatment.english}</p>
                        )}
                        {treatment.local && (
                          <div className="p-3 rounded-lg bg-white/80 border border-blue-200">
                            <p className="text-gray-700 text-base font-medium leading-relaxed">{treatment.local}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-amber-900 mb-2">Important Reminder</h4>
                    <p className="text-gray-700 leading-relaxed">
                      Always follow the recommended dosage and safety guidelines when applying treatments. 
                      Consult with local agricultural experts for region-specific advice.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          ) : null}

          {/* Additional Notes Tab */}
          {notesKey && sections[notesKey] && (
            <TabsContent value="notes" className="p-6 md:p-8 space-y-6 m-0">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-7 w-7 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Additional Notes</h2>
                </div>
                <p className="text-gray-600">Important supplementary information and guidelines</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(extractTableData(sections[notesKey])).map(([key, value]) => (
                  <DetailCard key={key} label={key} english={value.english} local={value.local} color="purple" />
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}
