

// API URL configuration for development and production

const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://your-backend-url.onrender.com'  // Replace this after deploying backend
    : 'http://localhost:5000')

export default API_URL