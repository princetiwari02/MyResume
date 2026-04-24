import express from "express";
import multer from "multer";
import pdf from "pdf-parse/lib/pdf-parse.js";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { protect } from "../middleware/auth.js";

dotenv.config();

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

const ATS_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function extractTextFromPDF(buffer) {
  try {
    const data = await pdf(buffer);
    return data?.text?.trim() || "";
  } catch (error) {
    console.error("PDF extraction failed:", error);
    throw new Error("Failed to extract text from PDF");
  }
}

function extractJSONFromText(text) {
  if (!text || typeof text !== "string") return null;

  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {}

  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");

  if (first !== -1 && last !== -1 && last > first) {
    try {
      return JSON.parse(cleaned.slice(first, last + 1));
    } catch {}
  }

  return null;
}

function normalizeStringArray(value, fallback) {
  if (Array.isArray(value)) {
    const arr = value
      .map((item) => String(item).trim())
      .filter(Boolean);

    if (arr.length > 0) return arr;
  }

  return fallback;
}

function normalizeAnalysis(parsed) {
  const score = Math.min(100, Math.max(0, Number(parsed?.score) || 0));

  let matchLevel = "Poor";
  if (score >= 80) matchLevel = "Excellent";
  else if (score >= 60) matchLevel = "Good";
  else if (score >= 40) matchLevel = "Fair";

  const missingKeywords = normalizeStringArray(parsed?.missingKeywords, [
    "Job-specific keywords",
    "Technical skills",
    "Project impact",
  ]);

  const strengths = normalizeStringArray(parsed?.strengths, [
    "Resume has relevant experience or skills for this role.",
    "Resume structure is readable and suitable for ATS scanning.",
    "Some skills already match the job description.",
  ]);

  const improvements = normalizeStringArray(parsed?.improvements, [
    "Add missing keywords from the job description naturally in skills and projects.",
    "Improve project descriptions with measurable results and real impact.",
    "Mention role-specific tools, technologies, and responsibilities more clearly.",
  ]);

  return {
    score,
    matchLevel: parsed?.matchLevel || matchLevel,
    missingKeywords,
    strengths,
    improvements,
  };
}

function isRetryableError(error) {
  const status = Number(error?.status || error?.code || 0);
  const msg = String(error?.message || "").toLowerCase();

  return (
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    msg.includes("quota") ||
    msg.includes("rate limit") ||
    msg.includes("temporarily unavailable") ||
    msg.includes("service unavailable") ||
    msg.includes("high demand")
  );
}

function mapGeminiError(error) {
  const status = Number(error?.status || error?.code || 0);
  const msg = String(error?.message || "").toLowerCase();

  if (msg.includes("api key") || status === 401) {
    return {
      statusCode: 502,
      message: "AI service misconfigured: invalid API key.",
    };
  }

  if (status === 403 || msg.includes("permission") || msg.includes("forbidden")) {
    return {
      statusCode: 502,
      message: "AI service permission denied.",
    };
  }

  if (status === 429 || msg.includes("quota") || msg.includes("rate limit")) {
    return {
      statusCode: 502,
      message: "AI service quota exceeded. Please try again later.",
    };
  }

  return {
    statusCode: 502,
    message: "AI service unavailable. Please try again later.",
  };
}

async function generateWithFallback(prompt) {
  const errors = [];

  for (const model of ATS_MODELS) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature: 0.2,
            maxOutputTokens: 3000,
            responseMimeType: "application/json",
          },
        });

        const text = response?.text?.trim();

        if (!text) {
          throw new Error(`Empty response from ${model}`);
        }

        return { text, model };
      } catch (error) {
        errors.push({
          model,
          attempt,
          message: error?.message || String(error),
          status: error?.status || error?.code || null,
        });

        if (attempt < 3 && isRetryableError(error)) {
          await sleep(1500 * attempt);
          continue;
        }

        break;
      }
    }
  }

  const err = new Error("All Gemini models failed");
  err.details = errors;
  throw err;
}

async function getATSAnalysis(prompt) {
  const generation = await generateWithFallback(prompt);
  let parsed = extractJSONFromText(generation.text);

  if (parsed) {
    return {
      parsed,
      model: generation.model,
    };
  }

  const repairPrompt = `
Fix this invalid response and return ONLY valid JSON.

Invalid response:
${generation.text}

Return this exact JSON structure:
{
  "score": 0,
  "matchLevel": "Poor",
  "missingKeywords": [],
  "strengths": [],
  "improvements": []
}
`.trim();

  try {
    const retry = await generateWithFallback(repairPrompt);
    parsed = extractJSONFromText(retry.text);

    if (parsed) {
      return {
        parsed,
        model: retry.model,
      };
    }
  } catch (error) {
    console.error("JSON repair failed:", error);
  }

  return {
    parsed: {
      score: 70,
      matchLevel: "Good",
      missingKeywords: [
        "Job-specific keywords",
        "Technical skills",
        "Project impact",
      ],
      strengths: [
        "Resume has relevant experience or skills for this role.",
        "Resume structure is readable and suitable for ATS scanning.",
        "Some skills already match the job description.",
      ],
      improvements: [
        "Add missing keywords from the job description naturally in skills and projects.",
        "Improve project descriptions with measurable results and real impact.",
        "Mention role-specific tools, technologies, and responsibilities more clearly.",
      ],
    },
    model: generation.model,
  };
}

router.get("/gemini-test", async (req, res) => {
  try {
    const result = await generateWithFallback(
      `Return ONLY valid JSON: {"ok": true, "message": "Gemini is working"}`
    );

    const parsed = extractJSONFromText(result.text);

    return res.json({
      success: true,
      model: result.model,
      result: parsed || result.text,
    });
  } catch (error) {
    const mapped = mapGeminiError(error);

    return res.status(mapped.statusCode).json({
      success: false,
      message: mapped.message,
      debug: error?.details || error?.message || "Unknown error",
    });
  }
});

router.post("/analyze", protect, upload.single("resume"), async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Resume PDF is required",
      });
    }

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({
        message: "Job description is required",
      });
    }

    const resumeText = await extractTextFromPDF(req.file.buffer);

    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({
        message:
          "PDF contains very little text. Please upload a valid text-based PDF resume.",
      });
    }

    const prompt = `
You are an expert ATS resume analyzer.

Compare the resume with the job description.

Return ONLY valid JSON.
No markdown.
No explanation.
No trailing commas.

Important:
- strengths must NOT be empty.
- improvements must NOT be empty.
- missingKeywords must NOT be empty.
- Give specific useful points, not generic headings.

Rules:
- score must be number between 0 and 100
- matchLevel must be one of: "Excellent", "Good", "Fair", "Poor"
- missingKeywords must contain 5 to 10 important missing keywords
- strengths must contain 3 to 5 complete sentence strings
- improvements must contain 3 to 5 complete sentence strings

Job Description:
${jobDescription}

Resume:
${resumeText}

Return exactly this JSON structure:
{
  "score": 0,
  "matchLevel": "Poor",
  "missingKeywords": ["keyword 1", "keyword 2"],
  "strengths": ["strength sentence 1", "strength sentence 2", "strength sentence 3"],
  "improvements": ["improvement sentence 1", "improvement sentence 2", "improvement sentence 3"]
}
`.trim();

    const { parsed, model } = await getATSAnalysis(prompt);
    const analysis = normalizeAnalysis(parsed);

    return res.json({
      success: true,
      analysis,
      model,
    });
  } catch (error) {
    console.error("ATS analysis failed:", error?.details || error);

    if (error?.message === "Failed to extract text from PDF") {
      return res.status(500).json({
        message: error.message,
      });
    }

    const mapped = mapGeminiError(error);

    return res.status(mapped.statusCode).json({
      message: mapped.message,
    });
  }
});

export default router;