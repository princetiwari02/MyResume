// server/routes/ats.js
import express from "express";
import { protect } from "../middleware/auth.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import multer from "multer";
import pdf from "pdf-parse/lib/pdf-parse.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Multer: accept PDF in memory
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// Extract text from PDF buffer
async function extractTextFromPDF(buffer) {
  try {
    const data = await pdf(buffer);
    return (data && data.text) ? data.text : "";
  } catch (err) {
    throw new Error("Failed to extract text from PDF");
  }
}

// Safely extract JSON object from free-form text
function extractJSONFromText(text) {
  if (!text || typeof text !== "string") return null;

  // Try quick match for a JSON object block
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (err) {
      // fall through to aggressive attempts
    }
  }

  // Aggressive: find first "{" and last "}" and try to parse
  const first = text.indexOf("{");
  const last = text.lastIndexOf("}");
  if (first !== -1 && last !== -1 && last > first) {
    const substring = text.slice(first, last + 1);
    try {
      return JSON.parse(substring);
    } catch (err) {
      return null;
    }
  }

  return null;
}

// Attempt to generate with a list of candidate models.
// It will try each model once (with optional small retry), and return the first successful text + model name.
// If all fail, throws an Error with details.
async function tryGenerateWithModels(prompt, options = {}) {
  // Candidate models in order of preference - adjust if Google publishes different recommended names
  const candidateModels = [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-1.5-flash-latest",
  ];

  const maxAttemptsPerModel = options.attemptsPerModel || 1;

  const errors = [];

  for (const modelName of candidateModels) {
    for (let attempt = 1; attempt <= maxAttemptsPerModel; attempt++) {
      try {
        console.log(`Trying model ${modelName} (attempt ${attempt})`);
        const model = genAI.getGenerativeModel({ model: modelName });

        // generateContent returns an object with response; follow the SDK pattern
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        // if text empty, treat as failure
        if (!text || typeof text !== "string" || text.trim().length === 0) {
          throw new Error(`Empty response from model ${modelName}`);
        }

        console.log(`Model ${modelName} succeeded`);
        return { text, model: modelName };
      } catch (err) {
        // Log and continue trying next model
        console.error(`Model ${modelName} attempt ${attempt} failed:`, err?.message || err);
        errors.push({ model: modelName, attempt, message: err?.message || String(err), err });
        // if API key invalid, stop early and throw specific error
        const msg = String(err?.message || err || "");
        if (msg.includes("API key not valid") || msg.includes("API_KEY_INVALID") || msg.includes("401") || msg.includes("403")) {
          const e = new Error("AI API key invalid or unauthorized");
          e.type = "API_KEY_INVALID";
          e.original = err;
          throw e;
        }
        // if 404 for model not found, continue to next model
        // otherwise continue as well
      }
    }
  }

  const err = new Error("All Gemini model attempts failed");
  err.details = errors;
  throw err;
}

// POST /api/ats/analyze
// Protect middleware used to require authentication (keeps your existing security)
router.post("/analyze", protect, upload.single("resume"), async (req, res) => {
  try {
    const { jobDescription } = req.body;

    // Basic validation
    if (!req.file) {
      return res.status(400).json({ message: "Resume PDF is required" });
    }
    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ message: "Job description is required" });
    }

    // Extract text from PDF
    const resumeText = await extractTextFromPDF(req.file.buffer);
    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        message: "PDF contains very little text. Please upload a valid text-based PDF resume.",
      });
    }

    // Build a clear prompt asking for strict JSON only
    const prompt = `You are an expert ATS analyzer. Respond ONLY in JSON (no markdown/no commentary).
Job Description:
${jobDescription}

Resume:
${resumeText}

Return exactly a JSON object with:
{
  "score": <number 0-100>,
  "matchLevel": "<Excellent|Good|Fair|Poor>",
  "missingKeywords": ["..."],
  "strengths": ["..."],
  "improvements": ["..."]
}
Be precise and do not include any extra fields or explanations.
`;

    // Call AI (tries multiple models until one succeeds)
    let generation;
    try {
      generation = await tryGenerateWithModels(prompt, { attemptsPerModel: 1 });
    } catch (err) {
      // If the error indicates API key issue, respond with instructive message
      if (err && err.type === "API_KEY_INVALID") {
        console.error("Gemini API key invalid:", err.original || err);
        return res.status(502).json({ message: "AI service misconfigured: invalid API key." });
      }
      console.error("All Gemini attempts failed:", err);
      return res.status(502).json({ message: "AI service unavailable or models not supported. Please try again later." });
    }

    const { text: rawText, model: usedModel } = generation;
    // Clean common fences and try to parse JSON
    const cleaned = (rawText || "").replace(/```json|```/g, "").trim();

    const parsed = extractJSONFromText(cleaned);
    if (!parsed) {
      console.error("Failed to parse JSON from AI response. Raw:", cleaned.slice(0, 1000));
      return res.status(500).json({ message: "Failed to parse AI response. Please try again." });
    }

    // Normalize fields
    const analysis = {
      score: Math.min(100, Math.max(0, Number(parsed.score) || 0)),
      matchLevel: parsed.matchLevel || (parsed.score >= 80 ? "Excellent" : parsed.score >= 60 ? "Good" : parsed.score >= 40 ? "Fair" : "Poor"),
      missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [],
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
    };

    return res.json({ success: true, analysis, model: usedModel });
  } catch (error) {
    console.error("ATS Analysis Error (unexpected):", error);
    return res.status(500).json({ message: "Failed to analyze resume", error: error?.message || String(error) });
  }
});

export default router;