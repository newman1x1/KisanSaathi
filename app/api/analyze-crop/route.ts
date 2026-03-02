import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const LANGUAGE_NAMES: Record<string, { native: string; code: string }> = {
  English: { native: "English", code: "en" },
  Hindi: { native: "हिंदी", code: "hi" },
  Punjabi: { native: "ਪੰਜਾਬੀ", code: "pa" },
  Marathi: { native: "मराठी", code: "mr" },
  Telugu: { native: "తెలుగు", code: "te" },
}

export async function POST(request: NextRequest) {
  try {
    const { image, language, state, soilType } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 })
    }

    // Extract base64 data and mime type
    const matches = image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 })
    }

    const mimeType = matches[1]
    const base64Data = matches[2]

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY environment variable is not set" }, { status: 500 })
    }

    const userLanguage = language || "English"
    const langInfo = LANGUAGE_NAMES[userLanguage] || LANGUAGE_NAMES["English"]

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

    const validationPrompt = `Analyze this image and determine if it contains a plant, crop, or agricultural subject that can be diagnosed for diseases or health issues.

Respond in this exact format:
IS_VALID: [YES/NO]
REASON: [Brief explanation in English]
REASON_LOCAL: [Brief explanation in ${userLanguage} (${langInfo.native})]

If the image contains:
- A person, animal, or non-plant subject: Respond NO
- Unclear or blurry content: Respond NO  
- A plant, crop, leaf, or agricultural subject: Respond YES

Be strict - only agricultural/plant images should be marked as YES.`

    const validationResult = await model.generateContent([
      validationPrompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      },
    ])

    const validationText = (await validationResult.response.text()).trim()
    console.log("[v0] Validation result:", validationText)

    const isValidMatch = validationText.match(/IS_VALID:\s*(YES|NO)/i)
    const reasonMatch = validationText.match(/REASON:\s*(.+?)(?=REASON_LOCAL:|$)/i)
    const reasonLocalMatch = validationText.match(/REASON_LOCAL:\s*(.+?)$/i)

    if (isValidMatch && isValidMatch[1].toUpperCase() === "NO") {
      const reason = reasonMatch
        ? reasonMatch[1].trim()
        : "This image does not contain a plant or crop that can be analyzed."
      const reasonLocal = reasonLocalMatch
        ? reasonLocalMatch[1].trim()
        : "This image cannot be analyzed for agricultural purposes."

      return NextResponse.json(
        {
          error: "Invalid image for crop analysis",
          reason: reason,
          reasonLocal: reasonLocal,
          isInvalidImage: true,
        },
        { status: 400 },
      )
    }

    const prompt = `You are an expert agricultural AI assistant specializing in crop disease diagnosis and plant health analysis.

Analyze this crop/plant image and provide a comprehensive, bilingual diagnosis report in English and ${userLanguage} (${langInfo.native}).

Context:
- Location: ${state || "India"}
- Soil Type: ${soilType || "Not specified"}
- Preferred Language: ${userLanguage}

IMPORTANT: Use this EXACT format with markdown tables for each section. Provide all content in BOTH English and ${userLanguage}:

## IDENTIFICATION (${langInfo.native} में पहचान)

| Feature | English | ${userLanguage} |
|:---|:---|:---|
| Plant/Crop Type | [value] | [${langInfo.native} में] |
| Growth Stage | [value] | [${langInfo.native} में] |
| Overall Health | [value] | [${langInfo.native} में] |

## SYMPTOMS OBSERVED (देखे गए लक्षण)

| Feature | English | ${userLanguage} |
|:---|:---|:---|
| Visible Symptoms | [value] | [${langInfo.native} में] |
| Severity Level | [Mild/Moderate/Severe] | [${langInfo.native} में] |
| Affected Parts | [value] | [${langInfo.native} में] |

## DIAGNOSIS (निदान)

| Feature | English | ${userLanguage} |
|:---|:---|:---|
| Disease/Issue | [value] | [${langInfo.native} में] |
| Confidence Level | [High/Medium/Low - XX%] | [${langInfo.native} में] |
| Contributing Factors | [value] | [${langInfo.native} में] |

## TREATMENT RECOMMENDATIONS (उपचार की सिफारिशें)

1. **Immediate Actions (तुरंत करने वाले कदम)**
   - English: [Provide specific immediate steps like remove affected parts, apply emergency treatments, adjust watering, etc.]
   - ${userLanguage}: [${langInfo.native} में तुरंत करने वाले कदम]

2. **Short-term Treatment (1-2 weeks) (1-2 सप्ताह का इलाज)**
   - English: [Provide specific treatments like fungicide application, fertilizer schedule, organic remedies, etc.]
   - ${userLanguage}: [${langInfo.native} में 1-2 सप्ताह का इलाज]

3. **Long-term Prevention (लंबे समय की रोकथाम)**
   - English: [Provide prevention strategies like crop rotation, soil improvement, resistant varieties, etc.]
   - ${userLanguage}: [${langInfo.native} में लंबे समय की रोकथाम]

4. **Organic Alternatives (जैविक विकल्प)**
   - English: [Provide natural/organic treatment options like neem oil, compost, bio-pesticides, etc.]
   - ${userLanguage}: [${langInfo.native} में जैविक विकल्प]

## ADDITIONAL NOTES (अतिरिक्त नोट्स)

| Feature | English | ${userLanguage} |
|:---|:---|:---|
| Monitor | [value] | [${langInfo.native} में] |
| Seek Help When | [value] | [${langInfo.native} में] |
| Recovery Timeline | [value] | [${langInfo.native} में] |

CRITICAL INSTRUCTIONS:
- Write ALL content in BOTH English AND ${userLanguage} (${langInfo.native})
- Use proper ${userLanguage} script and grammar
- Follow the table format EXACTLY as shown
- Be specific, actionable, and provide complete bilingual content
- Ensure ${userLanguage} translations are accurate and natural
- For TREATMENT RECOMMENDATIONS section, provide detailed, practical steps
- Do NOT use placeholder text like [detailed steps] - provide actual treatment recommendations
- Include specific product names, application rates, and timelines where possible
- Make sure each treatment step is actionable and clear
- ALWAYS provide at least 4 treatment recommendations with specific details
- Each treatment must include both English and ${userLanguage} content
- Provide specific dosages, timings, and application methods
- Include both chemical and organic treatment options`

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      },
    ])

    const response = await result.response
    const text = response.text()

    console.log("[v0] Analysis report generated, length:", text.length)

    return NextResponse.json({
      success: true,
      report: text,
    })
  } catch (error) {
    console.error("[v0] Crop analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze crop image" }, { status: 500 })
  }
}

