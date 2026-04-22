import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FileText, Plus, X, Sparkles } from "lucide-react"
import { useAuth } from "../context/AuthContext"

const emptyResume = {
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
    soft: [],
  },
  projects: [],
  achievements: [],
  education: [],
  experience: [],
  certificates: [],
}

function ResumePage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const storageKey = user?.uid ? `resumeData_${user.uid}` : "resumeData_guest"

  const [resume, setResume] = useState(emptyResume)
  const [isDraftLoaded, setIsDraftLoaded] = useState(false)

  const normalizeResumeData = (parsed) => {
    if (!parsed || typeof parsed !== "object") return emptyResume

    const normalized = { ...emptyResume, ...parsed }

    if (Array.isArray(normalized.skills)) {
      normalized.skills = {
        languages: [],
        frameworks: normalized.skills || [],
        tools: [],
        soft: [],
      }
    }

    normalized.skills = {
      languages: normalized.skills?.languages || [],
      frameworks: normalized.skills?.frameworks || [],
      tools: normalized.skills?.tools || [],
      soft: normalized.skills?.soft || [],
    }

    normalized.certificates = normalized.certificates || []
    normalized.projects = normalized.projects || []
    normalized.achievements = normalized.achievements || []
    normalized.education = normalized.education || []
    normalized.experience = normalized.experience || []

    normalized.personal = {
      name: normalized.personal?.name || "",
      email: normalized.personal?.email || "",
      phone: normalized.personal?.phone || "",
      linkedin: normalized.personal?.linkedin || "",
      github: normalized.personal?.github || "",
      portfolio: normalized.personal?.portfolio || "",
    }

    normalized.summary = normalized.summary || ""

    return normalized
  }

  const [languageInput, setLanguageInput] = useState("")
  const [frameworkInput, setFrameworkInput] = useState("")
  const [toolInput, setToolInput] = useState("")
  const [softSkillInput, setSoftSkillInput] = useState("")

  const [projectInput, setProjectInput] = useState({
    title: "",
    description: "",
    tech: "",
    duration: "",
    liveLink: "",
  })

  const [achievementInput, setAchievementInput] = useState("")
  const [certificateInput, setCertificateInput] = useState("")
  const [educationInput, setEducationInput] = useState({
    degree: "",
    institution: "",
    year: "",
    score: "",
    location: "",
  })
  const [experienceInput, setExperienceInput] = useState({
    title: "",
    company: "",
    duration: "",
    description: "",
  })

  useEffect(() => {
    setIsDraftLoaded(false)

    const savedData = sessionStorage.getItem(storageKey)

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setResume(normalizeResumeData(parsed))
      } catch {
        setResume(emptyResume)
      }
    } else {
      setResume(emptyResume)
    }

    setIsDraftLoaded(true)
  }, [storageKey])

  useEffect(() => {
    if (!isDraftLoaded) return
    sessionStorage.setItem(storageKey, JSON.stringify(resume))
  }, [resume, storageKey, isDraftLoaded])

  const handleGenerateResume = () => {
    sessionStorage.setItem(storageKey, JSON.stringify(resume))
    navigate("/resume/preview")
  }

  const handleClearForm = () => {
    if (window.confirm("Are you sure you want to clear all form data?")) {
      sessionStorage.removeItem(storageKey)
      setResume(emptyResume)
      setLanguageInput("")
      setFrameworkInput("")
      setToolInput("")
      setSoftSkillInput("")
      setProjectInput({
        title: "",
        description: "",
        tech: "",
        duration: "",
        liveLink: "",
      })
      setAchievementInput("")
      setCertificateInput("")
      setEducationInput({
        degree: "",
        institution: "",
        year: "",
        score: "",
        location: "",
      })
      setExperienceInput({
        title: "",
        company: "",
        duration: "",
        description: "",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050d1a] via-[#0a1628] to-[#050d1a] text-white">
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
              onClick={handleClearForm}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg border border-red-500/30 transition-all text-red-400"
            >
              Clear Form
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
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

        <section className="mb-10 bg-[#0B1B2B] p-8 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-blue-400">💡</span>
            </div>
            Skills
          </h2>

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
                      skills: {
                        ...resume.skills,
                        languages: [...resume.skills.languages, languageInput.trim()],
                      },
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
                    skills: {
                      ...resume.skills,
                      languages: [...resume.skills.languages, languageInput.trim()],
                    },
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
                <div
                  key={index}
                  className="flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full border border-blue-500/30"
                >
                  <span>{lang}</span>
                  <button
                    onClick={() =>
                      setResume({
                        ...resume,
                        skills: {
                          ...resume.skills,
                          languages: resume.skills.languages.filter((_, i) => i !== index),
                        },
                      })
                    }
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

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
                      skills: {
                        ...resume.skills,
                        frameworks: [...resume.skills.frameworks, frameworkInput.trim()],
                      },
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
                    skills: {
                      ...resume.skills,
                      frameworks: [...resume.skills.frameworks, frameworkInput.trim()],
                    },
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
                <div
                  key={index}
                  className="flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full border border-blue-500/30"
                >
                  <span>{fw}</span>
                  <button
                    onClick={() =>
                      setResume({
                        ...resume,
                        skills: {
                          ...resume.skills,
                          frameworks: resume.skills.frameworks.filter((_, i) => i !== index),
                        },
                      })
                    }
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

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
                      skills: {
                        ...resume.skills,
                        tools: [...resume.skills.tools, toolInput.trim()],
                      },
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
                    skills: {
                      ...resume.skills,
                      tools: [...resume.skills.tools, toolInput.trim()],
                    },
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
                <div
                  key={index}
                  className="flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full border border-blue-500/30"
                >
                  <span>{tool}</span>
                  <button
                    onClick={() =>
                      setResume({
                        ...resume,
                        skills: {
                          ...resume.skills,
                          tools: resume.skills.tools.filter((_, i) => i !== index),
                        },
                      })
                    }
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

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
                      skills: {
                        ...resume.skills,
                        soft: [...resume.skills.soft, softSkillInput.trim()],
                      },
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
                    skills: {
                      ...resume.skills,
                      soft: [...resume.skills.soft, softSkillInput.trim()],
                    },
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
                <div
                  key={index}
                  className="flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full border border-blue-500/30"
                >
                  <span>{soft}</span>
                  <button
                    onClick={() =>
                      setResume({
                        ...resume,
                        skills: {
                          ...resume.skills,
                          soft: resume.skills.soft.filter((_, i) => i !== index),
                        },
                      })
                    }
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

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
              <div
                key={index}
                className="bg-gradient-to-r from-blue-500/5 to-blue-600/5 p-6 rounded-xl relative border border-blue-500/20"
              >
                <button
                  onClick={() =>
                    setResume({ ...resume, experience: resume.experience.filter((_, i) => i !== index) })
                  }
                  className="absolute top-4 right-4 text-red-400"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-semibold text-blue-300">{exp.company}</h3>
                <p className="text-gray-400 mb-2">
                  {exp.title} | {exp.duration}
                </p>
                <p className="text-gray-300 text-sm whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

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
              <div
                key={index}
                className="bg-gradient-to-r from-blue-500/5 to-blue-600/5 p-6 rounded-xl relative border border-blue-500/20"
              >
                <button
                  onClick={() =>
                    setResume({ ...resume, projects: resume.projects.filter((_, i) => i !== index) })
                  }
                  className="absolute top-4 right-4 text-red-400"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-semibold text-blue-300">{project.title}</h3>
                {project.tech && <p className="text-sm text-blue-400 mb-2">Tech: {project.tech}</p>}
                {project.duration && <p className="text-sm text-gray-400 mb-2">{project.duration}</p>}
                {project.liveLink && (
                  <p className="text-sm mb-2">
                    <span className="text-blue-400">Live: </span>
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline hover:text-blue-400"
                    >
                      {project.liveLink}
                    </a>
                  </p>
                )}
                <p className="text-gray-300 whitespace-pre-line">{project.description}</p>
              </div>
            ))}
          </div>
        </section>

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
              <div
                key={index}
                className="bg-gradient-to-r from-blue-500/5 to-blue-600/5 p-6 rounded-xl relative border border-blue-500/20"
              >
                <button
                  onClick={() =>
                    setResume({ ...resume, education: resume.education.filter((_, i) => i !== index) })
                  }
                  className="absolute top-4 right-4 text-red-400"
                >
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
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-500/5 to-blue-600/5 rounded-xl border border-blue-500/20 group"
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="flex-1 text-gray-300">{achievement}</span>
                <button
                  onClick={() =>
                    setResume({ ...resume, achievements: resume.achievements.filter((_, i) => i !== index) })
                  }
                  className="text-red-400 opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

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
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-500/5 to-blue-600/5 rounded-xl border border-blue-500/20 group"
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="flex-1 text-gray-300">{cert}</span>
                <button
                  onClick={() =>
                    setResume({ ...resume, certificates: resume.certificates.filter((_, i) => i !== index) })
                  }
                  className="text-red-400 opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

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