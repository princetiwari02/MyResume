import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { FileText, Target, Sparkles, Zap, Shield, TrendingUp, Menu, X, ChevronRight, CheckCircle } from "lucide-react"
import { useState } from "react"

function LandingPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleCreateResume = (e) => {
    e.preventDefault()
    if (!user) {
      navigate("/auth")
    } else {
      navigate("/resume")
    }
  }

  const handleCheckScore = (e) => {
    e.preventDefault()
    if (!user) {
      navigate("/auth")
    } else {
      navigate("/ats")
    }
  }

  const handleAuthNavigate = (e) => {
    e.preventDefault()
    navigate("/auth")
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Get display name from Firebase user
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User'
  const firstLetter = displayName.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050d1a] via-[#0a1628] to-[#050d1a] text-white relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[150px] opacity-20"></div>
      </div>

      {/* Decorative Stars */}
      <div className="absolute top-40 right-20 animate-pulse opacity-40">
        <Sparkles className="w-6 h-6 text-blue-400" />
      </div>
      <div className="absolute top-60 left-32 animate-pulse opacity-30" style={{ animationDelay: '0.5s' }}>
        <Sparkles className="w-4 h-4 text-purple-400" />
      </div>
      <div className="absolute bottom-40 right-40 animate-pulse opacity-30" style={{ animationDelay: '1s' }}>
        <Sparkles className="w-5 h-5 text-blue-300" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 md:px-12 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate("/")}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50">
              <FileText className="w-7 h-7" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
              ResumeAI
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-5 py-2.5 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">{firstLetter}</span>
                  </div>
                  <span className="text-sm font-medium">Hi, {displayName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2.5 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-all duration-300 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleAuthNavigate}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/30"
              >
                Login / Sign Up
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 mx-6 bg-[#0f1f35] rounded-2xl p-6 border border-white/10 z-20 backdrop-blur-lg shadow-2xl">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="font-bold">{firstLetter}</span>
                  </div>
                  <span className="font-medium">{displayName}</span>
                </div>
                <button 
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="px-6 py-3 bg-white/5 rounded-xl border border-white/10 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={(e) => { e.preventDefault(); navigate('/auth'); setMenuOpen(false); }}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl font-medium"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center mt-16 md:mt-24 px-6">
        
        {/* Badge */}
        <div className="mb-6 px-6 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full backdrop-blur-sm">
          <p className="text-sm text-blue-300 font-medium flex items-center gap-2">
            <Zap className="w-4 h-4" />
            AI-Powered Resume Builder & ATS Analyzer
          </p>
        </div>

        {/* Main Headline */}
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
          <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
            Optimize Your Career
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Path with AI.
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-gray-300 text-lg md:text-xl max-w-3xl mb-12 leading-relaxed">
          Create professional resumes, analyze job descriptions, and get AI-powered insights 
          to land your dream job faster.
        </p>

        {/* Main Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl w-full mb-20">
          
          {/* Create Resume Card */}
          <div className="group relative bg-gradient-to-br from-[#0f1f35] to-[#0a1628] p-8 md:p-10 rounded-3xl border border-white/10 hover:border-blue-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer overflow-hidden">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              {/* Icon */}
              <div className="mb-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform duration-500">
                <FileText className="w-8 h-8" />
              </div>

              {/* Title */}
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                Create Resume
              </h3>

              {/* Description */}
              <p className="text-gray-400 mb-6 leading-relaxed">
                Build your professional resume with our intuitive form builder. 
                Add skills, projects, achievements, and download as PDF.
              </p>

              {/* Features List */}
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  Multiple sections (Skills, Projects, Education)
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  Live preview & PDF download
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  Professional templates
                </li>
              </ul>

              {/* Button */}
              <button
                onClick={handleCreateResume}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-blue-500/50"
              >
                Create Resume
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Check Resume Score Card */}
          <div className="group relative bg-gradient-to-br from-[#0f1f35] to-[#0a1628] p-8 md:p-10 rounded-3xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer overflow-hidden">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              {/* Icon */}
              <div className="mb-6 w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform duration-500">
                <Target className="w-8 h-8" />
              </div>

              {/* Title */}
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">
                Check Resume Score
              </h3>

              {/* Description */}
              <p className="text-gray-400 mb-6 leading-relaxed">
                Upload your resume and job description. Get AI-powered ATS score, 
                missing keywords, and improvement suggestions.
              </p>

              {/* Features List */}
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-purple-400" />
                  ATS compatibility score
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-purple-400" />
                  Missing keywords detection
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-purple-400" />
                  AI improvement tips
                </li>
              </ul>

              {/* Button */}
              <button
                onClick={handleCheckScore}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-semibold flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-purple-500/50"
              >
                Check Resume Score
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl w-full mt-20">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">ResumeAI</span>
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-xl font-bold mb-3">AI-Powered</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Leverage Gemini AI to optimize your resume and get personalized improvement suggestions.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="text-xl font-bold mb-3">ATS Optimized</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Ensure your resume passes Applicant Tracking Systems with our advanced analysis.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-xl font-bold mb-3">Professional Templates</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Choose from professionally designed templates to make your resume stand out.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-32 pb-10 px-6">
        <div className="max-w-7xl mx-auto border-t border-white/10 pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                ResumeAI
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2026 MyResume. Built By Vishal Tiwari to help you land your dream job.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage