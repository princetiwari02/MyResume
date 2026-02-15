import express from "express"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

const router = express.Router()

// Firebase login
router.post("/firebase-login", async (req, res) => {
  try {
    const { email, name } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    let user = await User.findOne({ email })

    if (!user) {
      user = await User.create({
        name: name || email.split("@")[0],
        email,
        password: "firebase-auth",
      })
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    )

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const user = await User.create({ name, email, password })

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    )

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    )

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
