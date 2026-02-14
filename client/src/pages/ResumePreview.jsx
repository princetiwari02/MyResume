import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Download, Edit, Home } from "lucide-react"
import axios from "axios"

function ResumePreview() {
  const navigate = useNavigate()
  const [resumeData, setResumeData] = useState(null)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem('resumeData')
    if (data) {
      setResumeData(JSON.parse(data))
    } else {
      navigate('/resume')
    }
  }, [navigate])

  // Keyword highlighting
  const highlightKeywords = (text) => {
    if (!text) return text
    const keywords = [
      'React', 'MERN', 'MongoDB', 'Node.js', 'Express', 'JWT', 
      'Authentication', 'REST API', 'Tailwind', 'MySQL', 'Django',
      'JavaScript', 'Python', 'HTML', 'CSS', 'Bootstrap', 'SQL',
      'Firebase', 'Git', 'GitHub', 'API', 'TypeScript', 'Next.js',
      'data structure', 'visualizer', 'e-commerce', 'website',
      'full-stack', 'dynamic', 'shopping cart', 'checkout',
      'online learning platform', 'responsive', 'interface',
      'SQLite', 'real time', 'product management', 'user authentication'
    ]
    
    let highlightedText = text
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
      highlightedText = highlightedText.replace(regex, `<strong>${keyword}</strong>`)
    })
    return highlightedText
  }

  const handleDownloadPDF = async () => {
    setDownloading(true)
    
    try {
      const token = localStorage.getItem('token')
      
      // Call backend API to generate PDF
      const response = await axios.post(
        'http://localhost:5000/api/pdf/generate',
        { resumeData },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          responseType: 'blob' // Important for binary data
        }
      )

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${resumeData?.personal?.name || 'Resume'}_CV.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      setDownloading(false)
    } catch (error) {
      console.error('PDF download failed:', error)
      setDownloading(false)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  if (!resumeData) return null

  // Color definitions
  const BLUE1 = '#0c1e5e' // Much darker blue for headings
  const BLUE2 = '#1a4d8f' // Much darker blue for links/dates
  const BLACK = '#000000'

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050d1a] via-[#0a1628] to-[#050d1a] text-white py-10 px-6">
      
      {/* Action Buttons */}
      <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all"
        >
          <Home className="w-5 h-5" />
          Home
        </button>
        
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/resume')}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all"
          >
            <Edit className="w-5 h-5" />
            Edit Resume
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className={`flex items-center gap-2 px-8 py-3 rounded-xl transition-all shadow-lg font-semibold ${
              downloading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-500/30'
            }`}
          >
            <Download className="w-5 h-5" />
            {downloading ? 'Generating Perfect PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Resume Content - FULL PREVIEW WITH SCROLL */}
      <div className="max-w-5xl mx-auto bg-white text-black shadow-2xl" style={{ maxHeight: '800px', overflowY: 'auto' }}>
        
        <div style={{ padding: '40px 50px', fontFamily: 'Calibri, Arial, sans-serif' }}>
          
          {/* HEADER - Name (LEFT ALIGNED) */}
          <div style={{ marginBottom: '8px' }}>
            <h1 style={{ 
              fontSize: '18pt', 
              fontWeight: '700', 
              color: BLUE1,
              margin: '0',
              lineHeight: '1.2'
            }}>
              {resumeData.personal.name}
            </h1>
          </div>

          {/* CONTACT INFO - 2 columns layout */}
          <div style={{ fontSize: '9pt', marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
            {/* Left side - LinkedIn, Email, Portfolio */}
            <div>
              {resumeData.personal.linkedin && (
                <div style={{ marginBottom: '2px' }}>
                  <span style={{ color: BLACK, fontWeight: '600' }}>LinkedIn: </span>
                  <a href={resumeData.personal.linkedin} style={{ color: BLUE2, textDecoration: 'none' }}>
                    {resumeData.personal.linkedin.replace('https://', '')}
                  </a>
                </div>
              )}
              {resumeData.personal.email && (
                <div style={{ marginBottom: '2px' }}>
                  <span style={{ color: BLACK, fontWeight: '600' }}>Email: </span>
                  <a href={`mailto:${resumeData.personal.email}`} style={{ color: BLUE2, textDecoration: 'none' }}>
                    {resumeData.personal.email}
                  </a>
                </div>
              )}
              {resumeData.personal.portfolio && (
                <div>
                  <span style={{ color: BLACK, fontWeight: '600' }}>Portfolio: </span>
                  <a href={resumeData.personal.portfolio} style={{ color: BLUE2, textDecoration: 'none' }}>
                    {resumeData.personal.portfolio.replace('https://', '')}
                  </a>
                </div>
              )}
            </div>
            
            {/* Right side - GitHub and Mobile */}
            <div>
              {resumeData.personal.github && (
                <div style={{ marginBottom: '2px' }}>
                  <span style={{ color: BLACK, fontWeight: '600' }}>Github: </span>
                  <a href={resumeData.personal.github} style={{ color: BLUE2, textDecoration: 'none' }}>
                    {resumeData.personal.github.replace('https://', '')}
                  </a>
                </div>
              )}
              {resumeData.personal.phone && (
                <div>
                  <span style={{ color: BLACK, fontWeight: '600' }}>Mobile: </span>
                  <span style={{ color: BLUE2 }}>
                    {resumeData.personal.phone}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          {resumeData.summary && (
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ 
                fontSize: '11pt', 
                fontWeight: '700', 
                textTransform: 'uppercase', 
                color: BLUE1,
                borderBottom: `1px solid ${BLACK}`,
                paddingBottom: '2px',
                marginBottom: '8px'
              }}>
                Professional Summary
              </h2>
              <p style={{ fontSize: '10pt', lineHeight: '1.5', color: BLACK, margin: '0', textAlign: 'justify' }}>
                {resumeData.summary}
              </p>
            </div>
          )}

          {/* SKILLS - 4 subsections */}
          {(resumeData.skills.languages.length > 0 || resumeData.skills.frameworks.length > 0 || resumeData.skills.tools.length > 0 || resumeData.skills.soft.length > 0) && (
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ 
                fontSize: '11pt', 
                fontWeight: '700', 
                textTransform: 'uppercase', 
                color: BLUE1,
                borderBottom: `1px solid ${BLACK}`,
                paddingBottom: '2px',
                marginBottom: '8px'
              }}>
                Skills
              </h2>
              
              {/* Languages */}
              {resumeData.skills.languages.length > 0 && (
                <p style={{ fontSize: '10pt', lineHeight: '1.5', margin: '0 0 4px 0' }}>
                  <span style={{ fontWeight: '600', color: BLUE2 }}>Languages: </span>
                  <span style={{ color: BLACK }}>{resumeData.skills.languages.join(", ")}</span>
                </p>
              )}
              
              {/* Frameworks */}
              {resumeData.skills.frameworks.length > 0 && (
                <p style={{ fontSize: '10pt', lineHeight: '1.5', margin: '0 0 4px 0' }}>
                  <span style={{ fontWeight: '600', color: BLUE2 }}>Framework: </span>
                  <span style={{ color: BLACK }}>{resumeData.skills.frameworks.join(", ")}</span>
                </p>
              )}
              
              {/* Tools/Databases */}
              {resumeData.skills.tools.length > 0 && (
                <p style={{ fontSize: '10pt', lineHeight: '1.5', margin: '0 0 4px 0' }}>
                  <span style={{ fontWeight: '600', color: BLUE2 }}>DataBases: </span>
                  <span style={{ color: BLACK }}>{resumeData.skills.tools.join(", ")}</span>
                </p>
              )}
              
              {/* Soft Skills */}
              {resumeData.skills.soft.length > 0 && (
                <p style={{ fontSize: '10pt', lineHeight: '1.5', margin: '0' }}>
                  <span style={{ fontWeight: '600', color: BLUE2 }}>Soft Skills: </span>
                  <span style={{ color: BLACK }}>{resumeData.skills.soft.join(", ")}</span>
                </p>
              )}
            </div>
          )}

          {/* INTERNSHIP */}
          {resumeData.experience.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ 
                fontSize: '11pt', 
                fontWeight: '700', 
                textTransform: 'uppercase', 
                color: BLUE1,
                borderBottom: `1px solid ${BLACK}`,
                paddingBottom: '2px',
                marginBottom: '8px'
              }}>
                Internship
              </h2>
              {resumeData.experience.map((exp, index) => (
                <div key={index} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                    <div style={{ fontSize: '10pt', fontWeight: '700', color: BLUE2, textTransform: 'uppercase' }}>
                      {exp.company}
                    </div>
                    <div style={{ fontSize: '9pt', color: BLUE2 }}>
                      {exp.duration}
                    </div>
                  </div>
                  <div style={{ fontSize: '10pt', color: BLACK, marginBottom: '4px' }}>
                    {exp.title}
                  </div>
                  <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '10pt', lineHeight: '1.4', listStyleType: 'disc' }}>
                    {exp.description.split('\n').filter(line => line.trim()).map((line, idx) => (
                      <li key={idx} style={{ color: BLACK, marginBottom: '2px' }} dangerouslySetInnerHTML={{ __html: highlightKeywords(line.trim()) }} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* PROJECTS */}
          {resumeData.projects.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ 
                fontSize: '11pt', 
                fontWeight: '700', 
                textTransform: 'uppercase', 
                color: BLUE1,
                borderBottom: `1px solid ${BLACK}`,
                paddingBottom: '2px',
                marginBottom: '8px'
              }}>
                Projects
              </h2>
              {resumeData.projects.map((project, index) => (
                <div key={index} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                    <div style={{ fontSize: '10pt', fontWeight: '700', color: BLUE2 }}>
                      {project.title}
                    </div>
                    {project.duration && (
                      <div style={{ fontSize: '9pt', color: BLUE2, whiteSpace: 'nowrap', marginLeft: '10px' }}>
                        {project.duration}
                      </div>
                    )}
                  </div>
                  {project.tech && (
                    <div style={{ fontSize: '10pt', color: BLUE2, marginBottom: '4px' }}>
                      Tech: {project.tech}
                    </div>
                  )}
                  {project.liveLink && (
                    <div style={{ fontSize: '9pt', color: '#0066cc', marginBottom: '4px' }}>
                      <strong style={{ color: BLUE2 }}>Live:</strong> <a href={project.liveLink} target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', textDecoration: 'underline' }}>{project.liveLink}</a>
                    </div>
                  )}
                  <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '10pt', lineHeight: '1.4', listStyleType: 'disc' }}>
                    {project.description.split('\n').filter(line => line.trim()).map((line, idx) => (
                      <li key={idx} style={{ color: BLACK, marginBottom: '2px' }} dangerouslySetInnerHTML={{ __html: highlightKeywords(line.trim()) }} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* ACHIEVEMENTS */}
          {resumeData.achievements.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ 
                fontSize: '11pt', 
                fontWeight: '700', 
                textTransform: 'uppercase', 
                color: BLUE1,
                borderBottom: `1px solid ${BLACK}`,
                paddingBottom: '2px',
                marginBottom: '8px'
              }}>
                Achievements
              </h2>
              <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '10pt', lineHeight: '1.4', listStyleType: 'disc' }}>
                {resumeData.achievements.map((achievement, index) => {
                  // Extract date if present in format (Month Year - Month Year)
                  const dateMatch = achievement.match(/\(([^)]+)\)/)
                  const achievementText = dateMatch ? achievement.replace(/\s*\([^)]+\)\s*/, '') : achievement
                  const date = dateMatch ? dateMatch[1] : null
                  
                  return (
                    <li key={index} style={{ color: BLACK, marginBottom: '2px' }}>
                      {achievementText}
                      {date && <span style={{ fontSize: '9pt', color: BLUE2, marginLeft: '8px' }}>{date}</span>}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* CERTIFICATES */}
          {resumeData.certificates && resumeData.certificates.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ 
                fontSize: '11pt', 
                fontWeight: '700', 
                textTransform: 'uppercase', 
                color: BLUE1,
                borderBottom: `1px solid ${BLACK}`,
                paddingBottom: '2px',
                marginBottom: '8px'
              }}>
                Certificates
              </h2>
              {resumeData.certificates.map((cert, index) => {
                // Extract date if present
                const dateMatch = cert.match(/\(([^)]+)\)/)
                const certText = dateMatch ? cert.replace(/\s*\([^)]+\)\s*/, '') : cert
                const date = dateMatch ? dateMatch[1] : null
                
                return (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                    <div style={{ fontSize: '10pt', color: BLACK, flex: 1 }}>
                      {certText}
                    </div>
                    {date && <div style={{ fontSize: '9pt', color: BLUE2, whiteSpace: 'nowrap', marginLeft: '10px' }}>{date}</div>}
                  </div>
                )
              })}
            </div>
          )}

          {/* EDUCATION */}
          {resumeData.education.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ 
                fontSize: '11pt', 
                fontWeight: '700', 
                textTransform: 'uppercase', 
                color: BLUE1,
                borderBottom: `1px solid ${BLACK}`,
                paddingBottom: '2px',
                marginBottom: '8px'
              }}>
                Education
              </h2>
              {resumeData.education.map((edu, index) => (
                <div key={index} style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ fontSize: '10pt', fontWeight: '700', color: BLUE2 }}>
                      {edu.institution}
                    </div>
                    <div style={{ fontSize: '9pt', color: BLACK }}>
                      {edu.location}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ fontSize: '10pt', color: BLACK }}>
                      {edu.degree}
                      {edu.score && <span>; {edu.degree.toLowerCase().includes('bachelor') || edu.degree.toLowerCase().includes('b.tech') || edu.degree.toLowerCase().includes('technology') ? 'CGPA' : 'Percentage'}: {edu.score}</span>}
                    </div>
                    {edu.year && (
                      <div style={{ fontSize: '9pt', color: BLUE2, whiteSpace: 'nowrap', marginLeft: '10px' }}>
                        {edu.year}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Download Reminder */}
      <div className="max-w-5xl mx-auto mt-8 text-center">
        <p className="text-gray-400 text-sm">
          ✅ Server-Generated PDF • Perfect Quality • Crystal Clear • Vivid Colors • Professional Layout
        </p>
      </div>
    </div>
  )
}

export default ResumePreview