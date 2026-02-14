import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FileText, Plus, X, Sparkles } from "lucide-react"

function ResumePage() {
  const navigate = useNavigate()
  
  // Load existing data if coming from edit
  const [resume, setResume] = useState(() => {
    const savedData = localStorage.getItem('resumeData')
    if (savedData) {
      const parsed = JSON.parse(savedData)
      // Handle old skills format (array) vs new format (object)
      if (Array.isArray(parsed.skills)) {
        parsed.skills = {
          languages: [],
          frameworks: parsed.skills || [],
          tools: [],
          soft: []
        }
      }
      // Ensure skills object has all properties
      if (!parsed.skills) {
        parsed.skills = { languages: [], frameworks: [], tools: [], soft: [] }
      } else {
        parsed.skills = {
          languages: parsed.skills.languages || [],
          frameworks: parsed.skills.frameworks || [],
          tools: parsed.skills.tools || [],
          soft: parsed.skills.soft || []
        }
      }
      // Ensure certificates exists
      if (!parsed.certificates) {
        parsed.certificates = []
      }
      return parsed
    }
    return {
      personal: {
        name: "",
        email: "",
        phone: "",
        linkedin: "",
        github: "",
        portfolio: "",
      },
      summary: "",
      skills: {
        languages: [],
        frameworks: [],
        tools: [],
        soft: []
      },
      projects: [],
      achievements: [],
      education: [],
      experience: [],
      certificates: []
    }
  })

  const [languageInput, setLanguageInput] = useState("")
  const [frameworkInput, setFrameworkInput] = useState("")
  const [toolInput, setToolInput] = useState("")
  const [softSkillInput, setSoftSkillInput] = useState("")
  
  const [projectInput, setProjectInput] = useState({
    title: "",
    description: "",
    tech: "",
    duration: "",
    liveLink: ""
  })
  const [achievementInput, setAchievementInput] = useState("")
  const [certificateInput, setCertificateInput] = useState("")
  const [educationInput, setEducationInput] = useState({
    degree: "",
    institution: "",
    year: "",
    score: "",
    location: ""
  })
  const [experienceInput, setExperienceInput] = useState({
    title: "",
    company: "",
    duration: "",
    description: "",
  })

  // Keyword highlighting
  const highlightKeywords = (text) => {
    if (!text) return text
    const keywords = [
      'React', 'MERN', 'MongoDB', 'Node.js', 'Express', 'JWT', 
      'Authentication', 'REST API', 'Tailwind', 'MySQL', 'Django',
      'JavaScript', 'Python', 'HTML', 'CSS', 'Bootstrap', 'SQL',
      'Firebase', 'Git', 'GitHub', 'API', 'TypeScript', 'Next.js',
      'Redux', 'Vue', 'Angular', 'PostgreSQL', 'Docker', 'AWS',
      'data structure', 'visualizer', 'e-commerce', 'website',
      'full-stack', 'dynamic', 'shopping cart', 'checkout',
      'online learning platform', 'responsive', 'interface'
    ]
    
    let highlightedText = text
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
      highlightedText = highlightedText.replace(regex, `<strong>${keyword}</strong>`)
    })
    return highlightedText
  }

  const handleGenerateResume = () => {
    localStorage.setItem('resumeData', JSON.stringify(resume))
    navigate('/resume/preview')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050d1a] via-[#0a1628] to-[#050d1a] text-white">
      
      {/* Header */}
      <div className="bg-[#0B1B2B] border-b border-white/10 sticky top-0 z-10 backdrop-blur-lg bg-opacity-80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Build Your Resume
            </h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all form data?')) {
                  localStorage.removeItem('resumeData')
                  window.location.reload()
                }
              }}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg border border-red-500/30 transition-all text-red-400"
            >
              Clear Form
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Personal Info */}
        <section className="mb-10 bg-[#0B1B2B] p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-blue-400">📋</span>
            </div>
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Full Name *"
              className="p-4 rounded-xl bg-[#071227] border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
              value={resume.personal.name}
              onChange={(e) =>
                setResume({
                  ...resume,
                  personal: { ...resume.personal, name: e.target.value },
                })
              }
            />
            <input
              placeholder="Email *"
              type="email"
              className="p-4 rounded-xl bg-[#071227] border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
              value={resume.personal.email}
              onChange={(e) =>
                setResume({
                  ...resume,
                  personal: { ...resume.personal, email: e.target.value },
                })
              }
            />
            <input
              placeholder="Portfolio (full URL)"
              className="p-4 rounded-xl bg-[#071227] border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
              value={resume.personal.portfolio}
              onChange={(e) =>
                setResume({
                  ...resume,
                  personal: { ...resume.personal, portfolio: e.target.value },
                })
              }
            />
            <input
              placeholder="Phone Number *"
              className="p-4 rounded-xl bg-[#071227] border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
              value={resume.personal.phone}
              onChange={(e) =>
                setResume({
                  ...resume,
                  personal: { ...resume.personal, phone: e.target.value },
                })
              }
            />
            <input
              placeholder="LinkedIn Profile (full URL)"
              className="p-4 rounded-xl bg-[#071227] border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
              value={resume.personal.linkedin}
              onChange={(e) =>
                setResume({
                  ...resume,
                  personal: { ...resume.personal, linkedin: e.target.value },
                })
              }
            />
            <input
              placeholder="GitHub Profile (full URL)"
              className="p-4 rounded-xl bg-[#071227] border border-white/10 focus:border-blue-500 focus:outline-none transition-all md:col-span-2"
              value={resume.personal.github}
              onChange={(e) =>
                setResume({
                  ...resume,
                  personal: { ...resume.personal, github: e.target.value },
                })
              }
            />
          </div>
        </section>

        {/* Professional Summary */}
        <section className="mb-10 bg-[#0B1B2B] p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-blue-400">✨</span>
            </div>
            Professional Summary (Optional)
          </h2>
          <textarea
            placeholder="Write a brief professional summary about yourself..."
            rows={4}
            className="w-full p-4 rounded-xl bg-[#071227] border border-white/10 focus:border-blue-500 focus:outline-none transition-all resize-none"
            value={resume.summary}
            onChange={(e) => setResume({ ...resume, summary: e.target.value })}
          />
        </section>

        {/* Skills - 4 Categories */}
        <section className="mb-10 bg-[#0B1B2B] p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-blue-400">💡</span>
            </div>
            Skills
          </h2>

          {/* Languages */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-300 mb-3">Languages</h3>
            <div className="flex gap-3 mb-3">
              <input
                placeholder="Add language (e.g. C, C++, Java, Python)"
                className="flex-1 p-4 rounded-xl bg-[#071227] border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
                value={languageInput}
                onChange={(e) => setLanguageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && languageInput.trim()) {
                    setResume({
                      ...resume,
                      skills: { ...resume.skills, languages: [...resume.skills.languages, languageInput.trim()] }
                    })
                    setLanguageInput("")
                  }
                }}
              />
              <button
                onClick={() => {
                  if (!languageInput.trim()) return
                  setResume({
                    ...resume,
                    skills: { ...resume.skills, languages: [...resume.skills.languages, languageInput.trim()] }
                  })
                  setLanguageInput("")
                }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {resume.skills.languages.map((lang, index) => (
                <div key={index} className="flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full border border-blue-500/30">
                  <span>{lang}</span>
                  <button onClick={() => setResume({ ...resume, skills: { ...resume.skills, languages: resume.skills.languages.filter((_, i) => i !== index) } })}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Frameworks */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-300 mb-3">Frameworks & Technologies</h3>
            <div className="flex gap-3 mb-3">
              <input
                placeholder="Add framework (e.g. React.js, Node.js, Django)"
                className="flex-1 p-4 rounded-xl bg-[#071227] border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
                value={frameworkInput}
                onChange={(e) => setFrameworkInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && frameworkInput.trim()) {
                    setResume({
                      ...resume,
                      skills: { ...resume.skills, frameworks: [...resume.skills.frameworks, frameworkInput.trim()] }
                    })
                    setFrameworkInput("")
                  }
                }}
              />
              <button
                onClick={() => {
                  if (!frameworkInput.trim()) return
                  setResume({
                    ...resume,
                    skills: { ...resume.skills, frameworks: [...resume.skills.frameworks, frameworkInput.trim()] }
                  })
                  setFrameworkInput("")
                }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {resume.skills.frameworks.map((fw, index) => (
                <div key={index} className="flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full border border-blue-500/30">
                  <span>{fw}</span>
                  <button onClick={() => setResume({ ...resume, skills: { ...resume.skills, frameworks: resume.skills.frameworks.filter((_, i) => i !== index) } })}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tools/Databases */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-300 mb-3">Tools & Databases</h3>
            <div className="flex gap-3 mb-3">
              <input
                placeholder="Add tool (e.g. MongoDB, Git, Docker)"
                className="flex-1 p-4 rounded-xl bg-[#071227] border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
                value={toolInput}
                onChange={(e) => setToolInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && toolInput.trim()) {
                    setResume({
                      ...resume,
                      skills: { ...resume.skills, tools: [...resume.skills.tools, toolInput.trim()] }
                    })
                    setToolInput("")
                  }
                }}
              />
              <button
                onClick={() => {
                  if (!toolInput.trim()) return
                  setResume({
                    ...resume,
                    skills: { ...resume.skills, tools: [...resume.skills.tools, toolInput.trim()] }
                  })
                  setToolInput("")
                }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {resume.skills.tools.map((tool, index) => (
                <div key={index} className="flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full border border-blue-500/30">
                  <span>{tool}</span>
                  <button onClick={() => setResume({ ...resume, skills: { ...resume.skills, tools: resume.skills.tools.filter((_, i) => i !== index) } })}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Soft Skills */}
          <div>
            <h3 className="text-lg font-semibold text-blue-300 mb-3">Soft Skills</h3>
            <div className="flex gap-3 mb-3">
              <input
                placeholder="Add soft skill (e.g. Problem-Solving, Team work)"
                className="flex-1 p-4 rounded-xl bg-[#071227] border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
                value={softSkillInput}
                onChange={(e) => setSoftSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && softSkillInput.trim()) {
                    setResume({
                      ...resume,
                      skills: { ...resume.skills, soft: [...resume.skills.soft, softSkillInput.trim()] }
                    })
                    setSoftSkillInput("")
                  }
                }}
              />
              <button
                onClick={() => {
                  if (!softSkillInput.trim()) return
                  setResume({
                    ...resume,
                    skills: { ...resume.skills, soft: [...resume.skills.soft, softSkillInput.trim()] }
                  })
                  setSoftSkillInput("")
                }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {resume.skills.soft.map((soft, index) => (
                <div key={index} className="flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full border border-blue-500/30">
                  <span>{soft}</span>
                  <button onClick={() => setResume({ ...resume, skills: { ...resume.skills, soft: resume.skills.soft.filter((_, i) => i !== index) } })}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Internship/Training */}
        <section className="mb-10 bg-[#0B1B2B] p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-blue-400">💼</span>
            </div>
            Internship / Training
          </h2>
          <div className="bg-[#071227] p-6 rounded-xl mb-6 space-y-4 border border-white/10">
            <input
              placeholder="Company / Organization"
              className="w-full p-4 rounded-xl bg-[#0B1B2B] border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
              value={experienceInput.company}
              onChange={(e) => setExperienceInput({ ...experienceInput, company: e.target.value })}
            />
            <input
              placeholder="Position / Training Title"
              className="w-full p-4 rounded-xl bg-[#0B1B2B] border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
              value={experienceInput.title}
              onChange={(e) => setExperienceInput({ ...experienceInput, title: e.target.value })}
            />
            <input
              placeholder="Duration (e.g. June 2024- July 2024)"
              className="w-full p-4 rounded-xl bg-[#0B1B2B] border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
              value={experienceInput.duration}
              onChange={(e) => setExperienceInput({ ...experienceInput, duration: e.target.value })}
            />
            <textarea
              placeholder="Description (separate each bullet point with a new line)"
              rows={4}
              className="w-full p-4 rounded-xl bg-[#0B1B2B] border border-white/10 focus:border-blue-500 focus:outline-none transition-all resize-none"
              value={experienceInput.description}
              onChange={(e) => setExperienceInput({ ...experienceInput, description: e.target.value })}
            />
            <button
              onClick={() => {
                if (!experienceInput.title || !experienceInput.company) return
                setResume({ ...resume, experience: [...resume.experience, experienceInput] })
                setExperienceInput({ title: "", company: "", duration: "", description: "" })
              }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
          <div className="space-y-4">
            {resume.experience.map((exp, index) => (
              <div key={index} className="bg-gradient-to-r from-blue-500/5 to-blue-600/5 p-6 rounded-xl relative border border-blue-500/20">
                <button onClick={() => setResume({ ...resume, experience: resume.experience.filter((_, i) => i !== index) })} className="absolute top-4 right-4 text-red-400">
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-semibold text-blue-300">{exp.company}</h3>
                <p className="text-gray-400 mb-2">{exp.title} | {exp.duration}</p>
                <p className="text-gray-300 text-sm whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="mb-10 bg-[#0B1B2B] p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-blue-400">🚀</span>
            </div>
            Projects
          </h2>
          <div className="bg-[#071227] p-6 rounded-xl mb-6 space-y-4 border border-white/10">
            <input
              placeholder="Project Title"
              className="w-full p-4 rounded-xl bg-[#0B1B2B] border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
              value={projectInput.title}
              onChange={(e) => setProjectInput({ ...projectInput, title: e.target.value })}
            />
            <input
              placeholder="Tech Stack (e.g. MERN Stack, Django)"
              className="w-full p-4 rounded-xl bg-[#0B1B2B] border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
              value={projectInput.tech}
              onChange={(e) => setProjectInput({ ...projectInput, tech: e.target.value })}
            />
            <input
              placeholder="Duration (e.g. Jul 2024 - Nov 2024)"
              className="w-full p-4 rounded-xl bg-[#0B1B2B] border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
              value={projectInput.duration}
              onChange={(e) => setProjectInput({ ...projectInput, duration: e.target.value })}
            />
            <input
              placeholder="Live Link (e.g. https://myproject.vercel.app)"
              className="w-full p-4 rounded-xl bg-[#0B1B2B] border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
              value={projectInput.liveLink}
              onChange={(e) => setProjectInput({ ...projectInput, liveLink: e.target.value })}
            />
            <textarea
              placeholder="Description (separate each bullet point with a new line)"
              rows={4}
              className="w-full p-4 rounded-xl bg-[#0B1B2B] border border-white/10 focus:border-blue-500 focus:outline-none transition-all resize-none"
              value={projectInput.description}
              onChange={(e) => setProjectInput({ ...projectInput, description: e.target.value })}
            />
            <button
              onClick={() => {
                if (!projectInput.title || !projectInput.description) return
                setResume({ ...resume, projects: [...resume.projects, projectInput] })
                setProjectInput({ title: "", description: "", tech: "", duration: "", liveLink: "" })
              }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
          <div className="space-y-4">
            {resume.projects.map((project, index) => (
              <div key={index} className="bg-gradient-to-r from-blue-500/5 to-blue-600/5 p-6 rounded-xl relative border border-blue-500/20">
                <button onClick={() => setResume({ ...resume, projects: resume.projects.filter((_, i) => i !== index) })} className="absolute top-4 right-4 text-red-400">
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-semibold text-blue-300">{project.title}</h3>
                {project.tech && <p className="text-sm text-blue-400 mb-2">Tech: {project.tech}</p>}
                {project.duration && <p className="text-sm text-gray-400 mb-2">{project.duration}</p>}
                {project.liveLink && (
                  <p className="text-sm mb-2">
                    <span className="text-blue-400">Live: </span>
                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline hover:text-blue-400">
                      {project.liveLink}
                    </a>
                  </p>
                )}
                <p className="text-gray-300 whitespace-pre-line">{project.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mb-10 bg-[#0B1B2B] p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-blue-400">🎓</span>
            </div>
            Education
          </h2>
          <div className="bg-[#071227] p-6 rounded-xl mb-6 space-y-4 border border-white/10">
            <input
              placeholder="Institution / University"
              className="w-full p-4 rounded-xl bg-[#0B1B2B] border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
              value={educationInput.institution}
              onChange={(e) => setEducationInput({ ...educationInput, institution: e.target.value })}
            />
            <input
              placeholder="Degree / Qualification"
              className="w-full p-4 rounded-xl bg-[#0B1B2B] border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
              value={educationInput.degree}
              onChange={(e) => setEducationInput({ ...educationInput, degree: e.target.value })}
            />
            <input
              placeholder="Location (e.g. Phagwara, Punjab)"
              className="w-full p-4 rounded-xl bg-[#0B1B2B] border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
              value={educationInput.location}
              onChange={(e) => setEducationInput({ ...educationInput, location: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="Year (e.g. Sep 2022 – Present)"
                className="p-4 rounded-xl bg-[#0B1B2B] border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
                value={educationInput.year}
                onChange={(e) => setEducationInput({ ...educationInput, year: e.target.value })}
              />
              <input
                placeholder="CGPA / Percentage"
                className="p-4 rounded-xl bg-[#0B1B2B] border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
                value={educationInput.score}
                onChange={(e) => setEducationInput({ ...educationInput, score: e.target.value })}
              />
            </div>
            <button
              onClick={() => {
                if (!educationInput.degree) return
                setResume({ ...resume, education: [...resume.education, educationInput] })
                setEducationInput({ degree: "", institution: "", year: "", score: "", location: "" })
              }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add
            </button>
          </div>
          <div className="space-y-4">
            {resume.education.map((edu, index) => (
              <div key={index} className="bg-gradient-to-r from-blue-500/5 to-blue-600/5 p-6 rounded-xl relative border border-blue-500/20">
                <button onClick={() => setResume({ ...resume, education: resume.education.filter((_, i) => i !== index) })} className="absolute top-4 right-4 text-red-400">
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-semibold text-blue-300">{edu.institution}</h3>
                <p className="text-gray-400">{edu.degree}</p>
                <p className="text-gray-400 text-sm">{edu.location}</p>
                <div className="flex gap-4 mt-2 text-sm text-gray-400">
                  <span>{edu.year}</span>
                  {edu.score && <span>• {edu.score}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section className="mb-10 bg-[#0B1B2B] p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-blue-400">🏆</span>
            </div>
            Achievements
          </h2>
          <div className="flex gap-3 mb-6">
            <input
              placeholder="Add achievement"
              className="flex-1 p-4 rounded-xl bg-[#071227] border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
              value={achievementInput}
              onChange={(e) => setAchievementInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && achievementInput.trim()) {
                  setResume({ ...resume, achievements: [...resume.achievements, achievementInput.trim()] })
                  setAchievementInput("")
                }
              }}
            />
            <button
              onClick={() => {
                if (!achievementInput.trim()) return
                setResume({ ...resume, achievements: [...resume.achievements, achievementInput.trim()] })
                setAchievementInput("")
              }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-2">
            {resume.achievements.map((achievement, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-500/5 to-blue-600/5 rounded-xl border border-blue-500/20 group">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="flex-1 text-gray-300">{achievement}</span>
                <button onClick={() => setResume({ ...resume, achievements: resume.achievements.filter((_, i) => i !== index) })} className="text-red-400 opacity-0 group-hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Certificates */}
        <section className="mb-10 bg-[#0B1B2B] p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-blue-400">📜</span>
            </div>
            Certificates
          </h2>
          <div className="flex gap-3 mb-6">
            <input
              placeholder="Add certificate (e.g. Full Stack Development (Nov 2023- Jul 2025))"
              className="flex-1 p-4 rounded-xl bg-[#071227] border border-white/10 focus:border-blue-500 focus:outline-none transition-all"
              value={certificateInput}
              onChange={(e) => setCertificateInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && certificateInput.trim()) {
                  setResume({ ...resume, certificates: [...resume.certificates, certificateInput.trim()] })
                  setCertificateInput("")
                }
              }}
            />
            <button
              onClick={() => {
                if (!certificateInput.trim()) return
                setResume({ ...resume, certificates: [...resume.certificates, certificateInput.trim()] })
                setCertificateInput("")
              }}
              className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-2">
            {resume.certificates.map((cert, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-500/5 to-blue-600/5 rounded-xl border border-blue-500/20 group">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="flex-1 text-gray-300">{cert}</span>
                <button onClick={() => setResume({ ...resume, certificates: resume.certificates.filter((_, i) => i !== index) })} className="text-red-400 opacity-0 group-hover:opacity-100">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Live Preview Section with COMPLETE resume and scrolling */}
        <section className="mb-10">
          <div className="bg-[#0B1B2B] p-8 rounded-2xl border border-white/10">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              Live Preview
            </h2>
            
            <div className="bg-white text-black rounded-xl shadow-2xl max-w-4xl mx-auto">
              <div style={{ 
                padding: '40px 50px', 
                fontFamily: 'Calibri, Arial, sans-serif',
                maxHeight: '650px',
                overflowY: 'auto'
              }}>
                
                {/* Name */}
                <div style={{ marginBottom: '8px' }}>
                  <h1 style={{ fontSize: '18pt', fontWeight: '700', color: '#0c1e5e', margin: '0' }}>
                    {resume.personal.name || "Your Name"}
                  </h1>
                </div>

                {/* Contact Info */}
                <div style={{ fontSize: '9pt', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    {resume.personal.linkedin && <div style={{ marginBottom: '2px' }}><span style={{ color: '#000', fontWeight: '600' }}>LinkedIn: </span><span style={{ color: '#1a4d8f' }}>{resume.personal.linkedin.replace('https://', '')}</span></div>}
                    {resume.personal.email && <div style={{ marginBottom: '2px' }}><span style={{ color: '#000', fontWeight: '600' }}>Email: </span><span style={{ color: '#1a4d8f' }}>{resume.personal.email}</span></div>}
                    {resume.personal.portfolio && <div><span style={{ color: '#000', fontWeight: '600' }}>Portfolio: </span><span style={{ color: '#1a4d8f' }}>{resume.personal.portfolio.replace('https://', '')}</span></div>}
                  </div>
                  <div>
                    {resume.personal.github && <div style={{ marginBottom: '2px' }}><span style={{ color: '#000', fontWeight: '600' }}>Github: </span><span style={{ color: '#1a4d8f' }}>{resume.personal.github.replace('https://', '')}</span></div>}
                    {resume.personal.phone && <div><span style={{ color: '#000', fontWeight: '600' }}>Mobile: </span><span style={{ color: '#1a4d8f' }}>{resume.personal.phone}</span></div>}
                  </div>
                </div>

                {/* Professional Summary */}
                {resume.summary && (
                  <div style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '11pt', fontWeight: '700', textTransform: 'uppercase', color: '#0c1e5e', borderBottom: '1px solid #000', paddingBottom: '2px', marginBottom: '8px' }}>Professional Summary</h2>
                    <p style={{ fontSize: '10pt', color: '#000' }}>{resume.summary}</p>
                  </div>
                )}

                {/* Skills */}
                {(resume.skills.languages.length > 0 || resume.skills.frameworks.length > 0 || resume.skills.tools.length > 0 || resume.skills.soft.length > 0) && (
                  <div style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '11pt', fontWeight: '700', textTransform: 'uppercase', color: '#0c1e5e', borderBottom: '1px solid #000', paddingBottom: '2px', marginBottom: '8px' }}>Skills</h2>
                    {resume.skills.languages.length > 0 && <p style={{ fontSize: '10pt', margin: '0 0 4px 0' }}><span style={{ fontWeight: '600', color: '#1a4d8f' }}>Languages: </span><span style={{ color: '#000' }}>{resume.skills.languages.join(", ")}</span></p>}
                    {resume.skills.frameworks.length > 0 && <p style={{ fontSize: '10pt', margin: '0 0 4px 0' }}><span style={{ fontWeight: '600', color: '#1a4d8f' }}>Framework: </span><span style={{ color: '#000' }}>{resume.skills.frameworks.join(", ")}</span></p>}
                    {resume.skills.tools.length > 0 && <p style={{ fontSize: '10pt', margin: '0 0 4px 0' }}><span style={{ fontWeight: '600', color: '#1a4d8f' }}>DataBases: </span><span style={{ color: '#000' }}>{resume.skills.tools.join(", ")}</span></p>}
                    {resume.skills.soft.length > 0 && <p style={{ fontSize: '10pt', margin: '0' }}><span style={{ fontWeight: '600', color: '#1a4d8f' }}>Soft Skills: </span><span style={{ color: '#000' }}>{resume.skills.soft.join(", ")}</span></p>}
                  </div>
                )}

                {/* Internship */}
                {resume.experience.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '11pt', fontWeight: '700', textTransform: 'uppercase', color: '#0c1e5e', borderBottom: '1px solid #000', paddingBottom: '2px', marginBottom: '8px' }}>Internship</h2>
                    {resume.experience.map((exp, i) => (
                      <div key={i} style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div style={{ fontSize: '10pt', fontWeight: '700', color: '#1a4d8f', textTransform: 'uppercase' }}>{exp.company}</div>
                          <div style={{ fontSize: '9pt', color: '#1a4d8f' }}>{exp.duration}</div>
                        </div>
                        <div style={{ fontSize: '10pt', color: '#000' }}>{exp.title}</div>
                        <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '10pt', listStyleType: 'disc' }}>
                          {exp.description.split('\n').filter(line => line.trim()).map((line, idx) => (
                            <li key={idx} style={{ color: '#000' }} dangerouslySetInnerHTML={{ __html: highlightKeywords(line.trim()) }} />
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Projects - WITH LIVE LINK */}
                {resume.projects.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '11pt', fontWeight: '700', textTransform: 'uppercase', color: '#0c1e5e', borderBottom: '1px solid #000', paddingBottom: '2px', marginBottom: '8px' }}>Projects</h2>
                    {resume.projects.map((proj, i) => (
                      <div key={i} style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div style={{ fontSize: '10pt', fontWeight: '700', color: '#1a4d8f' }}>{proj.title}</div>
                          {proj.duration && <div style={{ fontSize: '9pt', color: '#1a4d8f' }}>{proj.duration}</div>}
                        </div>
                        {proj.tech && <div style={{ fontSize: '10pt', color: '#1a4d8f' }}>Tech: {proj.tech}</div>}
                        {proj.liveLink && (
                          <div style={{ fontSize: '9pt' }}>
                            <strong style={{ color: '#1a4d8f' }}>Live:</strong>{' '}
                            <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', textDecoration: 'underline' }}>{proj.liveLink}</a>
                          </div>
                        )}
                        <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '10pt', listStyleType: 'disc' }}>
                          {proj.description.split('\n').filter(line => line.trim()).map((line, idx) => (
                            <li key={idx} style={{ color: '#000' }} dangerouslySetInnerHTML={{ __html: highlightKeywords(line.trim()) }} />
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {/* Achievements */}
                {resume.achievements.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '11pt', fontWeight: '700', textTransform: 'uppercase', color: '#0c1e5e', borderBottom: '1px solid #000', paddingBottom: '2px', marginBottom: '8px' }}>Achievements</h2>
                    <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '10pt', listStyleType: 'disc' }}>
                      {resume.achievements.map((ach, i) => (
                        <li key={i} style={{ color: '#000' }}>{ach}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Certificates */}
                {resume.certificates && resume.certificates.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '11pt', fontWeight: '700', textTransform: 'uppercase', color: '#0c1e5e', borderBottom: '1px solid #000', paddingBottom: '2px', marginBottom: '8px' }}>Certificates</h2>
                    {resume.certificates.map((cert, i) => {
                      const dateMatch = cert.match(/\(([^)]+)\)/)
                      const certText = dateMatch ? cert.replace(/\s*\([^)]+\)\s*/, '') : cert
                      const date = dateMatch ? dateMatch[1] : null
                      return (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <div style={{ fontSize: '10pt', color: '#000' }}>{certText}</div>
                          {date && <div style={{ fontSize: '9pt', color: '#1a4d8f' }}>{date}</div>}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Education - DEGREE ON ONE LINE, CGPA ON NEXT */}
                {resume.education.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '11pt', fontWeight: '700', textTransform: 'uppercase', color: '#0c1e5e', borderBottom: '1px solid #000', paddingBottom: '2px', marginBottom: '8px' }}>Education</h2>
                    {resume.education.map((edu, i) => (
                      <div key={i} style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div style={{ fontSize: '10pt', fontWeight: '700', color: '#1a4d8f' }}>{edu.institution}</div>
                          <div style={{ fontSize: '9pt', color: '#000' }}>{edu.location}</div>
                        </div>
                        <div style={{ fontSize: '10pt', color: '#000' }}>{edu.degree}</div>
                        {edu.score && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ fontSize: '10pt', color: '#000' }}>
                              {edu.degree.toLowerCase().includes('bachelor') || edu.degree.toLowerCase().includes('b.tech') ? 'CGPA' : 'Percentage'}: {edu.score}
                            </div>
                            {edu.year && <div style={{ fontSize: '9pt', color: '#1a4d8f' }}>{edu.year}</div>}
                          </div>
                        )}
                        {!edu.score && edu.year && <div style={{ fontSize: '9pt', color: '#1a4d8f', textAlign: 'right' }}>{edu.year}</div>}
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          </div>
        </section>

        {/* Generate Resume Button */}
        <div className="flex justify-center">
          <button
            onClick={handleGenerateResume}
            className="bg-gradient-to-r from-blue-500 to-blue-600 px-12 py-5 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-3 shadow-2xl shadow-blue-500/50 text-lg font-semibold"
          >
            <Sparkles className="w-6 h-6" />
            Generate Resume
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResumePage