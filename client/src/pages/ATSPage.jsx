import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Target, Upload, FileText, TrendingUp, AlertCircle, CheckCircle, Sparkles, ArrowLeft } from "lucide-react"

function ATSPage() {
  const navigate = useNavigate()
  const [jobDescription, setJobDescription] = useState("")
  const [resumeFile, setResumeFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type === "application/pdf") {
      setResumeFile(file)
      setError("")
    } else {
      setError("Please upload a PDF file")
      setResumeFile(null)
    }
  }

  const handleAnalyze = async () => {
    if (!resumeFile) {
      setError("Please upload your resume")
      return
    }
    if (!jobDescription.trim()) {
      setError("Please enter job description")
      return
    }

    setLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("resume", resumeFile)
      formData.append("jobDescription", jobDescription)

      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:5000/api/ats/analyze", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Analysis failed")
      }

      setResult(data.analysis)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getScoreBgColor = (score) => {
    if (score >= 80) return "from-green-500 to-green-600"
    if (score >= 60) return "from-yellow-500 to-yellow-600"
    return "from-red-500 to-red-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050d1a] via-[#0a1628] to-[#050d1a] text-white">
      
      {/* Header */}
      <div className="bg-[#0B1B2B] border-b border-white/10 sticky top-0 z-10 backdrop-blur-lg bg-opacity-80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              ATS Resume Analyzer
            </h1>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {!result ? (
          <>
            {/* Input Section */}
            <div className="max-w-4xl mx-auto">
              
              {/* Info Card */}
              <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-2xl p-6 mb-8">
                <div className="flex items-start gap-4">
                  <Sparkles className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">
                      AI-Powered ATS Analysis
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Upload your resume and paste the job description. Our AI will analyze how well your resume matches the job requirements, identify missing keywords, and provide actionable improvement suggestions.
                    </p>
                  </div>
                </div>
              </div>

              {/* Upload Resume */}
              <div className="bg-[#0B1B2B] p-8 rounded-2xl border border-white/10 mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-purple-400" />
                  Upload Your Resume
                </h2>
                
                <label className="border-2 border-dashed border-white/20 hover:border-purple-500/50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-[#071227] hover:bg-[#0a1628]">
                  <FileText className="w-12 h-12 text-purple-400 mb-3" />
                  <span className="text-gray-300 mb-2">
                    {resumeFile ? resumeFile.name : "Click to upload PDF"}
                  </span>
                  <span className="text-sm text-gray-500">PDF only, max 5MB</span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Job Description */}
              <div className="bg-[#0B1B2B] p-8 rounded-2xl border border-white/10 mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  Job Description
                </h2>
                <textarea
                  placeholder="Paste the complete job description here..."
                  rows={12}
                  className="w-full p-4 rounded-xl bg-[#071227] border border-white/10 focus:border-purple-500 focus:outline-none transition-all resize-none text-gray-200"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-300">{error}</p>
                </div>
              )}

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all ${
                  loading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg shadow-purple-500/30'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyze Resume
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Results Section */}
            <div className="max-w-5xl mx-auto">
              
              {/* Score Card */}
              <div className="bg-[#0B1B2B] p-10 rounded-2xl border border-white/10 mb-8 text-center">
                <div className="mb-6">
                  <div className={`inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-r ${getScoreBgColor(result.score)} p-1 mb-4`}>
                    <div className="w-full h-full bg-[#0B1B2B] rounded-full flex flex-col items-center justify-center">
                      <div className={`text-5xl font-bold ${getScoreColor(result.score)}`}>
                        {result.score}%
                      </div>
                      <div className="text-gray-400 text-sm mt-1">ATS Score</div>
                    </div>
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  {result.matchLevel} Match
                </h2>
                <p className="text-gray-400">
                  Your resume is {result.matchLevel.toLowerCase()} match for this position
                </p>
              </div>

              {/* Two Column Layout */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                
                {/* Strengths */}
                <div className="bg-[#0B1B2B] p-8 rounded-2xl border border-white/10">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    Strengths
                  </h3>
                  <ul className="space-y-3">
                    {result.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="leading-relaxed">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missing Keywords */}
                <div className="bg-[#0B1B2B] p-8 rounded-2xl border border-white/10">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    Missing Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full text-red-300 text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Improvements */}
              <div className="bg-[#0B1B2B] p-8 rounded-2xl border border-white/10 mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-400">
                  <TrendingUp className="w-5 h-5" />
                  Improvement Suggestions
                </h3>
                <ul className="space-y-4">
                  {result.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-400 text-sm font-semibold">{index + 1}</span>
                      </div>
                      <span className="text-gray-300 leading-relaxed">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setResult(null)
                    setResumeFile(null)
                    setJobDescription("")
                  }}
                  className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all font-medium"
                >
                  Analyze Another
                </button>
                <button
                  onClick={() => navigate('/resume')}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl transition-all font-medium shadow-lg shadow-blue-500/30"
                >
                  Update My Resume
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ATSPage