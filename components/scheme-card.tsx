"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, ExternalLink, QrCode } from "lucide-react"
import QRCode from "qrcode"
import type { Scheme } from "@/lib/gov-schemes"

interface SchemeCardProps {
  scheme: Scheme
  aiExplanation?: string
}

export function SchemeCard({ scheme, aiExplanation }: SchemeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)
  const [isGeneratingQr, setIsGeneratingQr] = useState(false)

  const handleGenerateQR = async () => {
    if (qrCodeUrl) {
      // If QR code is already generated, clear it
      setQrCodeUrl(null)
      return
    }

    setIsGeneratingQr(true)
    try {
      const url = await QRCode.toDataURL(scheme.website, {
        width: 200,
        margin: 2,
        color: {
          dark: "#059669", // emerald-600
          light: "#ffffff",
        },
      })
      setQrCodeUrl(url)
    } catch (error) {
      console.error("Error generating QR code:", error)
    } finally {
      setIsGeneratingQr(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-2 border-emerald-100 hover:border-emerald-300 transition-all shadow-md hover:shadow-xl">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 pb-4">
          <CardTitle className="text-xl text-emerald-900 leading-tight">{scheme.title}</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">{scheme.objective}</p>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* AI Explanation (if provided) */}
          {aiExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg"
            >
              <p className="text-sm font-semibold text-blue-900 mb-1">✨ Why this scheme is relevant for you:</p>
              <p className="text-sm text-blue-800">{aiExplanation}</p>
            </motion.div>
          )}

          {/* Benefits - Always Visible */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Key Benefits:</p>
            <div className="flex flex-wrap gap-2">
              {scheme.benefits.slice(0, 3).map((benefit, index) => (
                <Badge key={index} variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                  {benefit.length > 50 ? `${benefit.substring(0, 50)}...` : benefit}
                </Badge>
              ))}
              {scheme.benefits.length > 3 && (
                <Badge variant="outline" className="text-emerald-700">
                  +{scheme.benefits.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* QR Code Section */}
          <div className="relative">
            <div
              className={`relative flex items-center justify-center h-48 rounded-lg border-2 border-dashed ${
                qrCodeUrl ? "border-emerald-300 bg-emerald-50" : "border-gray-300 bg-gray-50"
              } transition-all`}
            >
              {qrCodeUrl ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center gap-2"
                >
                  <img src={qrCodeUrl} alt="QR Code" className="w-40 h-40 rounded-lg shadow-md" />
                  <p className="text-xs text-emerald-700 font-medium">Scan to visit website</p>
                </motion.div>
              ) : (
                <div
                  className={`absolute inset-0 flex items-center justify-center ${
                    !qrCodeUrl ? "backdrop-blur-sm bg-white/30" : ""
                  }`}
                >
                  <Button
                    onClick={handleGenerateQR}
                    disabled={isGeneratingQr}
                    variant="outline"
                    className="gap-2 bg-white shadow-lg hover:bg-emerald-50 border-emerald-300"
                  >
                    <QrCode className="h-4 w-4" />
                    {isGeneratingQr ? "Generating..." : "Generate QR"}
                  </Button>
                </div>
              )}
            </div>
            {qrCodeUrl && (
              <Button
                onClick={handleGenerateQR}
                variant="ghost"
                size="sm"
                className="mt-2 w-full text-xs"
              >
                Clear QR Code
              </Button>
            )}
          </div>

          {/* Expandable Details Section */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 overflow-hidden"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Full Description:</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{scheme.description}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">All Benefits:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {scheme.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Eligibility Criteria:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {scheme.eligibility.map((criteria, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {criteria}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Application Process:</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{scheme.applicationProcess}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Required Documents:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {scheme.requiredDocuments.map((doc, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={scheme.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Visit Official Website
                  <ExternalLink className="h-4 w-4" />
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          {/* View Details Button */}
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="outline"
            className="w-full gap-2"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                View Details
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
