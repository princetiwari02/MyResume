import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"

import LandingPage from "./pages/LandingPage"
import AuthPage from "./pages/AuthPage"
import ResumePage from "./pages/ResumePage"
import ResumePreview from "./pages/ResumePreview"
import ATSPage from "./pages/ATSPage"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Protected Routes */}
          <Route
            path="/resume"
            element={
              <ProtectedRoute>
                <ResumePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume/preview"
            element={
              <ProtectedRoute>
                <ResumePreview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ats"
            element={
              <ProtectedRoute>
                <ATSPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App