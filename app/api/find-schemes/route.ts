import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { governmentSchemes, type Scheme } from "@/lib/gov-schemes"

interface AISearchResult extends Scheme {
  aiExplanation?: string
  relevanceScore?: number
}

export async function POST(request: NextRequest) {
  try {
    const { query, userProfile } = await request.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const geminiApiKey = process.env.GEMINI_API_KEY

    if (!geminiApiKey) {
      return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 })
    }

    // Step 1: Pre-filter schemes using simple keyword matching
    // This reduces the data sent to Gemini API
    const queryLower = query.toLowerCase()
    const preFilteredSchemes = governmentSchemes.filter((scheme) => {
      const searchText = `
        ${scheme.title} 
        ${scheme.objective} 
        ${scheme.description} 
        ${scheme.keywords.join(" ")} 
        ${scheme.benefits.join(" ")}
      `.toLowerCase()

      // Check for keyword matches
      const queryWords = queryLower.split(/\s+/).filter((word) => word.length > 2)
      const matchCount = queryWords.filter((word) => searchText.includes(word)).length

      return matchCount > 0
    })

    // If no matches from pre-filtering, use top 10 schemes
    const schemesToAnalyze =
      preFilteredSchemes.length > 0
        ? preFilteredSchemes.slice(0, 10)
        : governmentSchemes.slice(0, 10)

    // Step 2: Use Gemini AI to rank and explain relevance
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey)
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
      })

      const userContext = userProfile
        ? `
User Profile:
- State: ${userProfile.state || "Not specified"}
- Soil Type: ${userProfile.soilType || "Not specified"}
- Role: ${userProfile.role || "Farmer"}
- Address: ${userProfile.address || "Not specified"}
        `
        : "No user profile available"

      const schemesData = schemesToAnalyze
        .map(
          (scheme) => `
Scheme ID: ${scheme.id}
Title: ${scheme.title}
Objective: ${scheme.objective}
Description: ${scheme.description}
Benefits: ${scheme.benefits.join("; ")}
Eligibility: ${scheme.eligibility.join("; ")}
Keywords: ${scheme.keywords.join(", ")}
        `
        )
        .join("\n---\n")

      const prompt = `You are an expert agricultural advisor helping farmers find relevant government schemes.

${userContext}

User's Query: "${query}"

Available Schemes to Consider:
${schemesData}

Task: Analyze the user's query and their profile, then:
1. Select the top 3-5 most relevant schemes from the list above
2. For each selected scheme, provide a brief explanation (1-2 sentences) of WHY it's relevant to the user
3. Rank them by relevance

Return your response in this EXACT JSON format (no markdown, no code blocks, just pure JSON):
{
  "schemes": [
    {
      "id": <scheme_id_number>,
      "relevanceScore": <number between 0-100>,
      "explanation": "<brief explanation of relevance>"
    }
  ]
}

Guidelines:
- Consider the user's state, soil type, and role when determining relevance
- Match keywords from the query with scheme benefits and objectives
- Prioritize schemes that directly address the user's stated needs
- Keep explanations concise and actionable
- Return at least 3 schemes (unless fewer than 3 are relevant)
- Return no more than 5 schemes

Remember: Return ONLY the JSON object, nothing else.`

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      })

      const responseText = result.response.text()

      // Extract JSON from response
      let jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("Failed to parse AI response")
      }

      const aiResponse = JSON.parse(jsonMatch[0])

      // Step 3: Combine AI results with full scheme data
      const results: AISearchResult[] = aiResponse.schemes
        .map((aiResult: any) => {
          const scheme = governmentSchemes.find((s) => s.id === aiResult.id)
          if (!scheme) return null

          return {
            ...scheme,
            aiExplanation: aiResult.explanation,
            relevanceScore: aiResult.relevanceScore,
          }
        })
        .filter((result: AISearchResult | null): result is AISearchResult => result !== null)
        .sort((a: AISearchResult, b: AISearchResult) => (b.relevanceScore || 0) - (a.relevanceScore || 0))

      return NextResponse.json({
        schemes: results,
        query,
        totalFound: results.length,
      })
    } catch (aiError) {
      console.error("Gemini API error:", aiError)

      // Fallback: Return pre-filtered schemes without AI explanations
      const fallbackResults = schemesToAnalyze.slice(0, 5)
      return NextResponse.json({
        schemes: fallbackResults,
        query,
        totalFound: fallbackResults.length,
        warning: "AI analysis unavailable, showing keyword-matched schemes",
      })
    }
  } catch (error) {
    console.error("Scheme search error:", error)
    return NextResponse.json(
      {
        error: "Failed to search schemes",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}


