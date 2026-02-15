import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import mongoose from "mongoose"

import authRoutes from "./routes/auth.js"
import atsRoutes from "./routes/ats.js"
import pdfRoutes from "./routes/pdf.js"

// Load environment variables FIRST
dotenv.config()

const app = express()

// CORS - Allow both local and production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://myresume-tau-two.vercel.app',
  'https://myresume-6o3qqk6ty-bishal-tiwaris-projects-dea90b24.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean)

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(null, true) // Allow all in development, you can restrict in production
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check route
app.get("/", (req, res) => {
  res.json({ 
    status: "success",
    message: "ResumeAI API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/auth",
      ats: "/api/ats",
      pdf: "/api/pdf"
    }
  })
})

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/ats", atsRoutes)
app.use("/api/pdf", pdfRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: "Route not found",
    path: req.path
  })
})

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err)
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// Environment check
console.log("🔍 Environment Variables Check:")
console.log("PORT:", process.env.PORT || "5000")
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? `✅ Loaded (${process.env.GEMINI_API_KEY.substring(0, 10)}...)` : "❌ Missing")
console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Loaded" : "❌ Missing")
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Loaded" : "❌ Missing")
console.log("NODE_ENV:", process.env.NODE_ENV || "development")
console.log("---")

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined!")
  process.exit(1)
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully")
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message)
    process.exit(1)
  })

// Start Server
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🌐 Local: http://localhost:${PORT}`)
  console.log(`📋 Routes registered:`)
  console.log(`   - POST /api/auth/signup`)
  console.log(`   - POST /api/auth/login`)
  console.log(`   - POST /api/auth/firebase-login`)
  console.log(`   - POST /api/ats/analyze`)
  console.log(`   - POST /api/pdf/generate`)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err)
})

export default app