import express from "express"
import { protect } from "../middleware/auth.js"
import PDFDocument from "pdfkit"

const router = express.Router()

// POST /api/pdf/generate
router.post("/generate", protect, async (req, res) => {
  try {
    const { resumeData } = req.body

    if (!resumeData) {
      return res.status(400).json({ message: "Resume data is required" })
    }

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 24, bottom: 24, left: 50, right: 50 }
    })

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${resumeData.personal.name || 'Resume'}_CV.pdf"`)

    // Pipe PDF to response
    doc.pipe(res)

    // Colors
    const BLUE1 = '#0c1e5e'  // Dark blue for headings
    const BLUE2 = '#1a4d8f'  // Medium blue for subheadings/dates/links
    const BLACK = '#000000'

    // Page dimensions for A4
    const pageWidth = 595.28
    const pageHeight = 841.89
    const marginLeft = 50
    const marginRight = 50
    const contentWidth = pageWidth - marginLeft - marginRight

    // Helper function to add bullet with SELECTIVE keyword highlighting
    const addBulletWithKeywords = (text, yPos) => {
      if (yPos > pageHeight - 50) {
        doc.addPage()
        yPos = 50
      }
      
      const keywords = [
        'React', 'MERN', 'MongoDB', 'Node.js', 'Express', 'JWT', 
        'Authentication', 'REST API', 'Tailwind', 'MySQL', 'Django',
        'JavaScript', 'Python', 'HTML', 'CSS', 'Bootstrap', 'SQL',
        'Firebase', 'Git', 'GitHub', 'API', 'TypeScript', 'Next.js',
        'Redux', 'Vue', 'Angular', 'PostgreSQL', 'Docker', 'AWS',
        'data structure', 'visualizer', 'e-commerce', 'website',
        'full-stack', 'dynamic', 'shopping cart', 'checkout',
        'online learning platform', 'responsive', 'interface',
        'SQLite', 'real time', 'product management', 'user authentication',
        'Node', 'Scrum', 'Agile'
      ]
      
      // Draw bullet point
      doc.fontSize(10).fillColor(BLACK)
      doc.circle(marginLeft, yPos + 4, 2).fill()
      
      // Split text into words
      const words = text.split(' ')
      let currentX = marginLeft + 8
      let currentY = yPos
      const maxWidth = contentWidth - 8
      
      words.forEach((word, index) => {
        // Check if this word (without punctuation) matches a keyword
        const cleanWord = word.replace(/[.,!?;:()]/g, '')
        const isKeyword = keywords.some(kw => 
          cleanWord.toLowerCase() === kw.toLowerCase() ||
          kw.toLowerCase().includes(' ') && text.toLowerCase().includes(kw.toLowerCase())
        )
        
        // Choose font based on keyword match
        const font = isKeyword ? 'Helvetica-Bold' : 'Helvetica'
        doc.font(font).fillColor(BLACK)
        
        // Measure word width
        const wordText = word + (index < words.length - 1 ? ' ' : '')
        const wordWidth = doc.widthOfString(wordText)
        
        // Check if we need to wrap to next line
        if (currentX + wordWidth > marginLeft + maxWidth && currentX > marginLeft + 8) {
          currentY += 12
          currentX = marginLeft + 8
        }
        
        // Draw the word
        doc.text(wordText, currentX, currentY, { lineBreak: false, continued: false })
        currentX += wordWidth
      })
      
      return currentY + 15
    }

    // Helper functions
    const drawLine = (y) => {
      doc.strokeColor(BLACK).lineWidth(0.5).moveTo(marginLeft, y).lineTo(pageWidth - marginRight, y).stroke()
    }

    const addSectionHeading = (text, y) => {
      if (y > pageHeight - 100) {
        doc.addPage()
        y = 50
      }
      doc.fontSize(11).font('Helvetica-Bold').fillColor(BLUE1).text(text.toUpperCase(), marginLeft, y, { width: contentWidth })
      drawLine(y + 14)
      return y + 20
    }

    let yPos = 30

    // HEADER - Name
    doc.fontSize(18).font('Helvetica-Bold').fillColor(BLUE1).text(resumeData.personal.name, marginLeft, yPos, { width: contentWidth })
    yPos += 22

    // Contact Info - Two columns
    const leftContact = []
    const rightContact = []

    if (resumeData.personal.linkedin) leftContact.push(`LinkedIn: ${resumeData.personal.linkedin.replace('https://', '')}`)
    if (resumeData.personal.email) leftContact.push(`Email: ${resumeData.personal.email}`)
    if (resumeData.personal.portfolio) leftContact.push(`Portfolio: ${resumeData.personal.portfolio.replace('https://', '')}`)
    if (resumeData.personal.github) rightContact.push(`Github: ${resumeData.personal.github.replace('https://', '')}`)
    if (resumeData.personal.phone) rightContact.push(`Mobile: ${resumeData.personal.phone}`)

    const contactY = yPos
    const leftColumnWidth = contentWidth / 2 - 10
    const rightColumnX = marginLeft + contentWidth / 2 + 10
    
    doc.fontSize(9).font('Helvetica')
    
    leftContact.forEach((contact, i) => {
      const [label, value] = contact.split(': ')
      doc.fillColor(BLACK).font('Helvetica-Bold').text(label + ': ', marginLeft, contactY + (i * 11), { continued: true, width: leftColumnWidth })
      doc.fillColor(BLUE2).font('Helvetica').text(value, { width: leftColumnWidth - doc.widthOfString(label + ': ') })
    })

    rightContact.forEach((contact, i) => {
      const [label, value] = contact.split(': ')
      doc.fillColor(BLACK).font('Helvetica-Bold').text(label + ': ', rightColumnX, contactY + (i * 11), { continued: true, width: contentWidth / 2 - 10 })
      doc.fillColor(BLUE2).font('Helvetica').text(value, { width: (contentWidth / 2 - 10) - doc.widthOfString(label + ': ') })
    })

    yPos += Math.max(leftContact.length, rightContact.length) * 11 + 12

    // Professional Summary
    if (resumeData.summary) {
      yPos = addSectionHeading('Professional Summary', yPos)
      doc.fontSize(10).font('Helvetica').fillColor(BLACK).text(resumeData.summary, marginLeft, yPos, { align: 'justify', width: contentWidth })
      yPos += doc.heightOfString(resumeData.summary, { width: contentWidth, align: 'justify' }) + 10
    }

    // Skills
    if (resumeData.skills.languages.length > 0 || resumeData.skills.frameworks.length > 0 || resumeData.skills.tools.length > 0 || resumeData.skills.soft.length > 0) {
      yPos = addSectionHeading('Skills', yPos)
      
      if (resumeData.skills.languages.length > 0) {
        doc.fontSize(10).font('Helvetica-Bold').fillColor(BLUE2).text('Languages: ', marginLeft, yPos, { continued: true, width: contentWidth })
        doc.font('Helvetica').fillColor(BLACK).text(resumeData.skills.languages.join(', '), { width: contentWidth - doc.widthOfString('Languages: ') })
        yPos += doc.heightOfString(resumeData.skills.languages.join(', '), { width: contentWidth - doc.widthOfString('Languages: ') }) + 3
      }
      
      if (resumeData.skills.frameworks.length > 0) {
        doc.fontSize(10).font('Helvetica-Bold').fillColor(BLUE2).text('Framework: ', marginLeft, yPos, { continued: true, width: contentWidth })
        doc.font('Helvetica').fillColor(BLACK).text(resumeData.skills.frameworks.join(', '), { width: contentWidth - doc.widthOfString('Framework: ') })
        yPos += doc.heightOfString(resumeData.skills.frameworks.join(', '), { width: contentWidth - doc.widthOfString('Framework: ') }) + 3
      }
      
      if (resumeData.skills.tools.length > 0) {
        doc.fontSize(10).font('Helvetica-Bold').fillColor(BLUE2).text('DataBases: ', marginLeft, yPos, { continued: true, width: contentWidth })
        doc.font('Helvetica').fillColor(BLACK).text(resumeData.skills.tools.join(', '), { width: contentWidth - doc.widthOfString('DataBases: ') })
        yPos += doc.heightOfString(resumeData.skills.tools.join(', '), { width: contentWidth - doc.widthOfString('DataBases: ') }) + 3
      }
      
      if (resumeData.skills.soft.length > 0) {
        doc.fontSize(10).font('Helvetica-Bold').fillColor(BLUE2).text('Soft Skills: ', marginLeft, yPos, { continued: true, width: contentWidth })
        doc.font('Helvetica').fillColor(BLACK).text(resumeData.skills.soft.join(', '), { width: contentWidth - doc.widthOfString('Soft Skills: ') })
        yPos += doc.heightOfString(resumeData.skills.soft.join(', '), { width: contentWidth - doc.widthOfString('Soft Skills: ') }) + 3
      }
      
      yPos += 8
    }

    // Internship
    if (resumeData.experience.length > 0) {
      yPos = addSectionHeading('Internship', yPos)
      
      resumeData.experience.forEach(exp => {
        if (yPos > pageHeight - 150) {
          doc.addPage()
          yPos = 50
        }
        
        // Company name and Duration on SAME line
        const companyText = exp.company.toUpperCase()
        doc.fontSize(10).font('Helvetica-Bold').fillColor(BLUE2).text(companyText, marginLeft, yPos, { width: contentWidth - 120, continued: false })
        
        const durationX = pageWidth - marginRight - doc.widthOfString(exp.duration)
        doc.fontSize(9).fillColor(BLUE2).text(exp.duration, durationX, yPos, { width: doc.widthOfString(exp.duration) })
        yPos += 13
        
        // Title
        doc.fontSize(10).font('Helvetica').fillColor(BLACK).text(exp.title, marginLeft, yPos, { width: contentWidth })
        yPos += 14
        
        // Description bullets with keyword highlighting
        const bullets = exp.description.split('\n').filter(line => line.trim())
        bullets.forEach(bullet => {
          yPos = addBulletWithKeywords(bullet.trim(), yPos)
        })
        
        yPos += 6
      })
    }

    // Projects
    if (resumeData.projects.length > 0) {
      yPos = addSectionHeading('Projects', yPos)
      
      resumeData.projects.forEach(project => {
        if (yPos > pageHeight - 150) {
          doc.addPage()
          yPos = 50
        }
        
        // Project title and duration on SAME line
        doc.fontSize(10).font('Helvetica-Bold').fillColor(BLUE2).text(project.title, marginLeft, yPos, { width: contentWidth - 120, continued: false })
        
        if (project.duration) {
          const durationX = pageWidth - marginRight - doc.widthOfString(project.duration)
          doc.fontSize(9).fillColor(BLUE2).text(project.duration, durationX, yPos, { width: doc.widthOfString(project.duration) })
        }
        yPos += 13
        
        // Tech stack
        if (project.tech) {
          doc.fontSize(10).font('Helvetica').fillColor(BLUE2).text(`Tech: ${project.tech}`, marginLeft, yPos, { width: contentWidth })
          yPos += 13
        }
        
        // Live link - CLICKABLE
        if (project.liveLink) {
          doc.fontSize(9).font('Helvetica-Bold').fillColor(BLUE2).text('Live: ', marginLeft, yPos, { continued: true })
          doc.font('Helvetica').fillColor('#0066cc').text(project.liveLink, { link: project.liveLink, underline: true })
          yPos += 13
        }
        
        // Description bullets with keyword highlighting
        const bullets = project.description.split('\n').filter(line => line.trim())
        bullets.forEach(bullet => {
          yPos = addBulletWithKeywords(bullet.trim(), yPos)
        })
        
        yPos += 6
      })
    }

    // Achievements
    if (resumeData.achievements.length > 0) {
      yPos = addSectionHeading('Achievements', yPos)
      
      resumeData.achievements.forEach(achievement => {
        if (yPos > pageHeight - 50) {
          doc.addPage()
          yPos = 50
        }
        
        doc.fontSize(10).font('Helvetica').fillColor(BLACK)
        doc.circle(marginLeft, yPos + 4, 2).fill()
        doc.text(achievement, marginLeft + 8, yPos, { width: contentWidth - 8, lineBreak: true })
        yPos += doc.heightOfString(achievement, { width: contentWidth - 8 }) + 3
      })
      
      yPos += 6
    }

    // Certificates with dates in BLUE2
    if (resumeData.certificates && resumeData.certificates.length > 0) {
      yPos = addSectionHeading('Certificates', yPos)
      
      resumeData.certificates.forEach(cert => {
        if (yPos > pageHeight - 50) {
          doc.addPage()
          yPos = 50
        }
        
        const dateMatch = cert.match(/\(([^)]+)\)/)
        const certText = dateMatch ? cert.replace(/\s*\([^)]+\)\s*/, '') : cert
        const date = dateMatch ? dateMatch[1] : null
        
        doc.fontSize(10).font('Helvetica').fillColor(BLACK).text(certText, marginLeft, yPos, { width: date ? contentWidth - 120 : contentWidth })
        
        if (date) {
          const dateX = pageWidth - marginRight - doc.widthOfString(date)
          doc.fontSize(9).font('Helvetica-Bold').fillColor(BLUE2).text(date, dateX, yPos, { width: doc.widthOfString(date) })
        }
        
        yPos += doc.heightOfString(certText, { width: date ? contentWidth - 120 : contentWidth }) + 3
      })
      
      yPos += 6
    }

    // Education with dates in BLUE2
    if (resumeData.education.length > 0) {
      yPos = addSectionHeading('Education', yPos)
      
      resumeData.education.forEach(edu => {
        if (yPos > pageHeight - 80) {
          doc.addPage()
          yPos = 50
        }
        
        // Institution and Location on SAME line
        doc.fontSize(10).font('Helvetica-Bold').fillColor(BLUE2).text(edu.institution, marginLeft, yPos, { width: contentWidth - 120 })
        if (edu.location) {
          const locationX = pageWidth - marginRight - doc.widthOfString(edu.location)
          doc.fontSize(9).fillColor(BLACK).text(edu.location, locationX, yPos, { width: doc.widthOfString(edu.location) })
        }
        yPos += 13
        
        // Degree
        doc.fontSize(10).font('Helvetica').fillColor(BLACK).text(edu.degree, marginLeft, yPos, { width: contentWidth - 120 })
        yPos += 13
        
        // CGPA/Percentage with Year in BLUE2
        if (edu.score) {
          const scoreLabel = edu.degree.toLowerCase().includes('bachelor') || edu.degree.toLowerCase().includes('b.tech') ? 'CGPA' : 'Percentage'
          const scoreText = `${scoreLabel}: ${edu.score}`
          doc.fontSize(10).font('Helvetica').fillColor(BLACK).text(scoreText, marginLeft, yPos, { width: contentWidth - 120 })
          
          if (edu.year) {
            const yearX = pageWidth - marginRight - doc.widthOfString(edu.year)
            doc.fontSize(9).font('Helvetica-Bold').fillColor(BLUE2).text(edu.year, yearX, yPos, { width: doc.widthOfString(edu.year) })
          }
          yPos += 16
        } else if (edu.year) {
          const yearX = pageWidth - marginRight - doc.widthOfString(edu.year)
          doc.fontSize(9).font('Helvetica-Bold').fillColor(BLUE2).text(edu.year, yearX, yPos, { width: doc.widthOfString(edu.year) })
          yPos += 16
        }
      })
    }

    // Finalize PDF
    doc.end()

  } catch (error) {
    console.error('PDF generation error:', error)
    res.status(500).json({ 
      message: 'Failed to generate PDF', 
      error: error.message 
    })
  }
})

export default router