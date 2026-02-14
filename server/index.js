import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.js"
import atsRoutes from "./routes/ats.js"
import pdfRoutes from "./routes/pdf.js"

// Load environment variables
dotenv.config()

// Debug: Check if environment variables are loaded
console.log("🔍 Environment Variables Check:")
console.log("PORT:", process.env.PORT || "5000")
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? `✅ Loaded (${process.env.GEMINI_API_KEY.substring(0, 10)}...)` : "❌ Missing")
console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Loaded" : "❌ Missing")
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Loaded" : "❌ Missing")
console.log("---")

const app = express()

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',  // Local development
    'https://myresume-tau-two.vercel.app'  // Your deployed frontend
  ],
  credentials: true,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

// JSON parsing
app.use(express.json())
app.use("/api/pdf", pdfRoutes)

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/ats", atsRoutes)

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err)
    process.exit(1)
  })

// Health check route
app.get("/", (req, res) => {
  res.json({ 
    message: "ResumeAI API is running",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      ats: "/api/ats"
    }
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err)
  res.status(500).json({ 
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📍 API available at http://localhost:${PORT}`)
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`)
})