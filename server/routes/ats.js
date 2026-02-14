import express from "express"
import { protect } from "../middleware/auth.js"
import { GoogleGenerativeAI } from "@google/generative-ai"
import multer from "multer"
import pdf from "pdf-parse/lib/pdf-parse.js"
import dotenv from "dotenv"

dotenv.config()

const router = express.Router()
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Configure multer for PDF uploads
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true)
    } else {
      cb(new Error("Only PDF files are allowed"))
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
})

// Extract text from PDF
async function extractTextFromPDF(buffer) {
  try {
    const data = await pdf(buffer)
    return data.text
  } catch (error) {
    throw new Error("Failed to extract text from PDF")
  }
}

// Try multiple Gemini models with fallback
async function generateATSAnalysis(jobDescription, resumeText) {
  const modelsToTry = [
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-pro"
  ]

  const prompt = `You are an expert ATS (Applicant Tracking System) analyzer. Analyze how well this resume matches the job description.

Job Description:
${jobDescription}

Resume:
${resumeText}

IMPORTANT INSTRUCTIONS:
1. Calculate a REAL match score (0-100) based on:
   - Keyword matches between resume and job description
   - Skills alignment
   - Experience relevance
   - Education requirements
   
2. Be STRICT and ACCURATE:
   - If resume has NO relevant experience → score should be 20-40
   - If resume partially matches → score should be 40-70
   - If resume matches well → score should be 70-85
   - If resume is perfect match → score should be 85-95
   
3. Find ACTUAL missing keywords from the job description that are NOT in the resume

4. Provide SPECIFIC strengths and improvements based on the actual content

Respond ONLY with valid JSON (no markdown, no code blocks):
{
  "score": <actual_number_0_to_100>,
  "matchLevel": "<Excellent|Good|Fair|Poor>",
  "missingKeywords": ["<actual missing keyword 1>", "<actual missing keyword 2>"],
  "strengths": ["<specific strength from resume>", "<specific strength from resume>"],
  "improvements": ["<specific actionable improvement>", "<specific actionable improvement>"]
}
`

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName })
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = await response.text()
      return { text, model: modelName }
    } catch (err) {
      console.error(`Model ${modelName} failed:`, err.message)
      continue
    }
  }

  throw new Error("All Gemini models failed. Please check your API key.")
}

// POST /api/ats/analyze
router.post("/analyze", protect, upload.single("resume"), async (req, res) => {
  try {
    const { jobDescription } = req.body

    if (!req.file) {
      return res.status(400).json({ message: "Resume PDF is required" })
    }

    if (!jobDescription?.trim()) {
      return res.status(400).json({ message: "Job description is required" })
    }

    // Extract text from PDF
    const resumeText = await extractTextFromPDF(req.file.buffer)

    if (resumeText.length < 50) {
      return res.status(400).json({ 
        message: "PDF contains very little text. Please upload a valid text-based PDF resume." 
      })
    }

    // Generate analysis using Gemini AI
    const { text, model: usedModel } = await generateATSAnalysis(jobDescription, resumeText)

    // Clean and parse response
    let cleanText = text.trim()
    cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*/g, '')
    
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/)
    
    if (!jsonMatch) {
      console.error("Failed to parse AI response:", text)
      return res.status(500).json({ 
        message: "Failed to parse AI response. Please try again." 
      })
    }

    const analysis = JSON.parse(jsonMatch[0])

    // Validate and normalize data
    analysis.score = Math.min(100, Math.max(0, Number(analysis.score) || 0))
    
    // Determine match level based on score
    if (analysis.score >= 80) {
      analysis.matchLevel = "Excellent"
    } else if (analysis.score >= 60) {
      analysis.matchLevel = "Good"
    } else if (analysis.score >= 40) {
      analysis.matchLevel = "Fair"
    } else {
      analysis.matchLevel = "Poor"
    }
    
    analysis.missingKeywords = Array.isArray(analysis.missingKeywords) ? analysis.missingKeywords : []
    analysis.strengths = Array.isArray(analysis.strengths) ? analysis.strengths : []
    analysis.improvements = Array.isArray(analysis.improvements) ? analysis.improvements : []

    res.json({ 
      success: true, 
      analysis,
      model: usedModel 
    })

  } catch (error) {
    console.error("ATS Analysis Error:", error)
    res.status(500).json({ 
      message: "Failed to analyze resume", 
      error: error.message 
    })
  }
})

export default router