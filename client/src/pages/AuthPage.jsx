import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Mail, Lock, User, Chrome } from "lucide-react"

function AuthPage() {
  const navigate = useNavigate()
  const { user, signup, login, loginWithGoogle } = useAuth()

  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isLogin) {
        // Login
        await login(formData.email, formData.password)
      } else {
        // Sign up
        if (!formData.name.trim()) {
          throw new Error("Name is required")
        }
        await signup(formData.name, formData.email, formData.password)
      }
      navigate("/")
    } catch (err) {
      console.error("Auth error:", err)
      
      // Firebase error messages
      if (err.code === "auth/email-already-in-use") {
        setError("Email already in use")
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters")
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address")
      } else if (err.code === "auth/user-not-found") {
        setError("No account found with this email")
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password")
      } else if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password")
      } else {
        setError(err.message || "Authentication failed")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError("")
    setLoading(true)

    try {
      await loginWithGoogle()
      // Navigate will happen automatically after successful login
      navigate("/")
    } catch (err) {
      console.error("Google login error:", err)
      
      if (err.code === "auth/popup-closed-by-user") {
        setError("Login cancelled")
      } else if (err.code === "auth/popup-blocked") {
        setError("Popup blocked. Please allow popups for this site")
      } else if (err.code === "auth/cancelled-popup-request") {
        // User closed popup, no error message needed
        setError("")
      } else {
        setError("Google login failed. Please try again")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050d1a] via-[#0a1628] to-[#050d1a] flex items-center justify-center text-white px-6">
      
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 bg-[#0B1B2B] p-10 rounded-2xl w-full max-w-md shadow-2xl border border-white/10">

        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-center text-gray-400 mb-6">
          {isLogin ? "Login to continue" : "Sign up to get started"}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* Google Sign In - Primary CTA */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-lg bg-white text-gray-900 hover:bg-gray-100 transition-all font-semibold mb-6 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-gray-900/30 border-t-gray-900 rounded-full animate-spin"></div>
          ) : (
            <>
              <Chrome className="w-5 h-5" />
              Continue with Google
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#0B1B2B] text-gray-400">Or continue with email</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#071227] border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
                  onChange={handleChange}
                  value={formData.name}
                  required={!isLogin}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#071227] border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
                onChange={handleChange}
                value={formData.email}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#071227] border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
                onChange={handleChange}
                value={formData.password}
                required
                minLength={6}
                disabled={loading}
              />
            </div>
            {!isLogin && (
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition-all ${
              loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              isLogin ? "Login with Email" : "Sign Up with Email"
            )}
          </button>
        </form>

        {/* Toggle Login/Signup */}
        <p className="text-center mt-6 text-gray-400 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError("")
              setFormData({ name: "", email: "", password: "" })
            }}
            className="text-blue-400 ml-2 hover:underline font-medium"
            disabled={loading}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>

        {/* Back to Home */}
        <button
          onClick={() => navigate("/")}
          className="w-full mt-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
          disabled={loading}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  )
}

export default AuthPage