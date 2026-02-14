// API URL configuration for development and production
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://myresume-vgdx.onrender.com'
    : 'http://localhost:5000')

console.log('🔗 API URL:', API_URL)  // Add this to debug
console.log('🌍 Mode:', import.meta.env.MODE)  // Add this to debug

export default API_URL