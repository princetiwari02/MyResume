🚀 ResumeAI

ResumeAI is a full-stack web application that helps users create ATS-friendly resumes and analyze them using AI-powered keyword matching.

It combines a resume builder + ATS analyzer in one platform to improve job application success.

✨ Features
📝 Create professional resumes using a simple form
👀 Live resume preview while editing
📄 Download resume as ATS-friendly PDF
🤖 Analyze resume against job description
📊 Get ATS score (0–100)
🔍 See matched & missing keywords
💡 Get improvement suggestions
🔐 Secure login & authentication
🛠 Tech Stack

Frontend

React.js
Tailwind CSS
React Router

Backend

Node.js
Express.js
MongoDB

Other Tools

Gemini API (AI analysis)
html2pdf.js (PDF generation)
Multer (file upload)
pdf-parse (PDF text extraction)
📂 Project Structure
ResumeAI/
│
├── frontend/        # React app
│   ├── src/
│   └── components/
│
├── backend/         # Node + Express server
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── middleware/
│
└── README.md
⚙️ Installation
1. Clone the repository
git clone https://github.com/your-username/resumeai.git
cd resumeai
2. Setup Backend
cd backend
npm install

Create .env file:

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_api_key

Run backend:

npm run dev
3. Setup Frontend
cd frontend
npm install
npm run dev
🚀 Usage
Register / Login
Create your resume
Download PDF
Upload resume for ATS analysis
Improve based on suggestions
🔐 API Endpoints
Auth
POST /api/auth/register
POST /api/auth/login
ATS Analysis
POST /api/ats/analyze
Requires JWT token
Accepts PDF + job description
⚠️ Limitations
Only supports PDF resumes
Scanned PDFs may not work properly
Depends on Gemini API (rate limits possible)
🔮 Future Improvements
Multiple resume templates
Cover letter generator
LinkedIn integration
Mobile version
👨‍💻 Author

Bishal Tiwari

⭐ Support

If you like this project:

Star ⭐ the repo
Fork 🍴 it
Share 📢
