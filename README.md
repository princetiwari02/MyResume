<div align="center">

# 🚀 ResumeAI

### Build ATS-Friendly Resumes. Beat the Bots. Land the Job.

**ResumeAI** is a full-stack web application that combines a smart resume builder with an AI-powered ATS (Applicant Tracking System) analyzer — helping job seekers craft better resumes and understand exactly why they're getting rejected.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

</div>

---

## 📸 Overview

> Most resumes never reach a human — they're filtered out by ATS software before a recruiter ever sees them. **ResumeAI** solves this by letting you build a professional resume *and* instantly see how it performs against any job description.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📝 **Resume Builder** | Create professional resumes using a clean, guided form |
| 👀 **Live Preview** | See your resume update in real-time as you type |
| 📄 **PDF Export** | Download an ATS-friendly PDF with one click |
| 🤖 **AI ATS Analysis** | Paste any job description and get instant AI analysis |
| 📊 **ATS Score** | Receive a score from 0–100 showing how well your resume matches |
| 🔍 **Keyword Matching** | See exactly which keywords are matched and which are missing |
| 💡 **Smart Suggestions** | Get actionable AI-powered tips to improve your resume |
| 🔐 **Secure Auth** | Register and log in with JWT-protected accounts |

---

## 🛠 Tech Stack

### Frontend
- **React.js** — Component-based UI
- **Tailwind CSS** — Utility-first styling
- **React Router** — Client-side routing
- **html2pdf.js** — In-browser PDF generation

### Backend
- **Node.js** — Runtime environment
- **Express.js** — REST API framework
- **MongoDB** — Document database for user & resume data
- **Multer** — File upload handling
- **pdf-parse** — Extract text from uploaded PDFs

### AI & Tools
- **Gemini API** — Powers ATS keyword analysis and suggestions
- **JWT** — Secure authentication tokens
- **bcryptjs** — Password hashing

---

## 📂 Project Structure

```
ResumeAI/
│
├── frontend/                   # React application
│   └── src/
│       ├── components/         # Reusable UI components
│       │   ├── ResumeForm/     # Resume input form
│       │   ├── ResumePreview/  # Live preview panel
│       │   ├── ATSAnalyzer/    # ATS score & results UI
│       │   └── Auth/           # Login & register forms
│       ├── pages/              # Route-level pages
│       ├── context/            # Auth context / global state
│       └── utils/              # PDF generation helpers
│
├── backend/                    # Node + Express server
│   ├── routes/
│   │   ├── auth.routes.js      # Register / Login
│   │   └── ats.routes.js       # ATS analysis endpoint
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── ats.controller.js
│   ├── models/
│   │   └── user.model.js       # Mongoose user schema
│   ├── middleware/
│   │   └── auth.middleware.js  # JWT verification
│   └── server.js               # Entry point
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas) free tier)
- A [Gemini API key](https://ai.google.dev/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/resumeai.git
cd resumeai
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend server:

```bash
npm run dev
```

The API will run at `http://localhost:5000`

---

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

The app will run at `http://localhost:5173`

---

## 🚀 Usage

1. **Register / Login** — Create your account or log in
2. **Build your resume** — Fill in your details using the guided form
3. **Preview live** — Watch your resume render as you type
4. **Download PDF** — Export your ATS-friendly resume
5. **Analyze against a job** — Paste any job description and hit Analyze
6. **Review your score** — See your ATS score, matched & missing keywords
7. **Improve & iterate** — Follow the AI suggestions and re-analyze

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Create a new user account | ❌ |
| `POST` | `/api/auth/login` | Login and receive JWT token | ❌ |

### ATS Analysis

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/ats/analyze` | Analyze resume PDF against job description | ✅ JWT |

#### `POST /api/ats/analyze` — Request (multipart/form-data)

```
file          → PDF resume file (max 5MB)
jobDescription → Job description text
```

#### Response

```json
{
  "atsScore": 78,
  "matchedKeywords": ["React", "Node.js", "REST API", "MongoDB"],
  "missingKeywords": ["TypeScript", "Docker", "CI/CD"],
  "suggestions": [
    "Add experience with TypeScript to your skills section",
    "Mention any Docker or containerization experience",
    "Include keywords like 'CI/CD' or 'GitHub Actions' if applicable"
  ]
}
```

---

## ⚠️ Limitations

- Only **PDF resumes** are supported for ATS analysis
- **Scanned / image-based PDFs** cannot be parsed (text must be selectable)
- ATS analysis depends on the **Gemini API** — rate limits may apply on the free tier
- Resume builder exports are formatted for ATS parsing (single column, standard fonts)

---

## 🔮 Future Improvements

- [ ] Multiple resume templates (creative, minimal, executive)
- [ ] Cover letter generator using AI
- [ ] LinkedIn profile import
- [ ] Application tracker (save jobs + resume versions)
- [ ] Mobile-responsive resume builder
- [ ] Multi-language resume support

---

## 👨‍💻 Author

**Bishal Tiwari**

If you found this project helpful, please consider giving it a ⭐ on GitHub!

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ by Bishal Tiwari

</div>
