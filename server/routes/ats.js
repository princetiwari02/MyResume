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
  "gemini-3-flash-preview",
  "gemini-3.1-flash-lite-preview",
  "gemini-2.5-pro",
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
  } catch {
    // keep trying below
  }

  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");

  if (first !== -1 && last !== -1 && last > first) {
    const slice = cleaned.slice(first, last + 1);
    try {
      return JSON.parse(slice);
    } catch {
      return null;
    }
  }

  return null;
}

function normalizeAnalysis(parsed) {
  const score = Math.min(100, Math.max(0, Number(parsed?.score) || 0));

  let matchLevel = "Poor";
  if (score >= 80) matchLevel = "Excellent";
  else if (score >= 60) matchLevel = "Good";
  else if (score >= 40) matchLevel = "Fair";

  return {
    score,
    matchLevel: parsed?.matchLevel || matchLevel,
    missingKeywords: Array.isArray(parsed?.missingKeywords)
      ? parsed.missingKeywords.filter(Boolean)
      : [],
    strengths: Array.isArray(parsed?.strengths)
      ? parsed.strengths.filter(Boolean)
      : [],
    improvements: Array.isArray(parsed?.improvements)
      ? parsed.improvements.filter(Boolean)
      : [],
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
    msg.includes("high demand") ||
    msg.includes("temporarily unavailable") ||
    msg.includes("quota") ||
    msg.includes("rate limit") ||
    msg.includes("service unavailable")
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
      message: "AI service permission denied for this API key or project.",
    };
  }

  if (status === 404 || msg.includes("not found") || msg.includes("unsupported")) {
    return {
      statusCode: 502,
      message: "AI model not available for this API key or SDK configuration.",
    };
  }

  if (status === 429 || msg.includes("quota") || msg.includes("rate limit")) {
    return {
      statusCode: 502,
      message: "AI service quota exceeded or rate limited. Please try again later.",
    };
  }

  if (status === 503 || msg.includes("high demand") || msg.includes("unavailable")) {
    return {
      statusCode: 502,
      message: "AI service is temporarily busy. Please try again later.",
    };
  }

  return {
    statusCode: 502,
    message: "AI service unavailable or models not supported. Please try again later.",
  };
}

async function generateWithFallback(prompt) {
  const errors = [];

  for (const model of ATS_MODELS) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Trying ${model} (attempt ${attempt})`);

        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature: 0.2,
            maxOutputTokens: 900,
            responseMimeType: "application/json",
          },
        });

        const text = response?.text?.trim();

        if (!text) {
          throw new Error(`Empty response from ${model}`);
        }

        console.log(`Success with ${model}`);
        return { text, model };
      } catch (error) {
        const info = {
          model,
          attempt,
          status: error?.status || error?.code || null,
          message: error?.message || String(error),
        };

        console.error("Gemini call failed:", info);
        errors.push(info);

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

router.get("/gemini-test", async (req, res) => {
  try {
    const result = await generateWithFallback(
      `Reply ONLY with JSON: {"ok": true, "message": "Gemini is working"}`
    );

    return res.json({
      success: true,
      model: result.model,
      raw: result.text,
    });
  } catch (error) {
    console.error("Gemini test failed:", error?.details || error);
    const mapped = mapGeminiError(error);
    return res.status(mapped.statusCode).json({
      success: false,
      message: mapped.message,
      debug: error?.details || error?.message || "Unknown Gemini error",
    });
  }
});

router.post("/analyze", protect, upload.single("resume"), async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Resume PDF is required" });
    }

    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ message: "Job description is required" });
    }

    const resumeText = await extractTextFromPDF(req.file.buffer);

    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({
        message: "PDF contains very little text. Please upload a valid text-based PDF resume.",
      });
    }

    const prompt = `
You are an expert ATS resume analyzer.

Compare the resume against the job description and respond ONLY with valid JSON.
No markdown. No explanation. No extra text.

Scoring rules:
- score: number from 0 to 100
- matchLevel: one of "Excellent", "Good", "Fair", "Poor"
- missingKeywords: important keywords or skills missing from the resume
- strengths: short points about what matches well
- improvements: short actionable suggestions

Job Description:
${jobDescription}

Resume:
${resumeText}

Return exactly:
{
  "score": 0,
  "matchLevel": "Poor",
  "missingKeywords": [],
  "strengths": [],
  "improvements": []
}
`.trim();

    const generation = await generateWithFallback(prompt);
    const parsed = extractJSONFromText(generation.text);

    if (!parsed) {
      console.error("Could not parse Gemini JSON:", generation.text);
      return res.status(500).json({
        message: "Failed to parse AI response. Please try again.",
      });
    }

    const analysis = normalizeAnalysis(parsed);

    return res.json({
      success: true,
      analysis,
      model: generation.model,
    });
  } catch (error) {
    console.error("ATS analysis failed:", error?.details || error);

    if (error?.message === "Failed to extract text from PDF") {
      return res.status(500).json({ message: error.message });
    }

    const mapped = mapGeminiError(error);
    return res.status(mapped.statusCode).json({
      message: mapped.message,
    });
  }
});

export default router;