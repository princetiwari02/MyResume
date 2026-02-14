import { createContext, useContext, useState, useEffect } from "react"
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "firebase/auth"
import { auth } from "../firebase.config"
import axios from "axios"
import API_URL from "../config"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Helper function to get backend JWT token
  const getBackendToken = async (firebaseUser) => {
    try {
      // Get Firebase ID token
      const firebaseToken = await firebaseUser.getIdToken()
      
      // Send to backend to get JWT
      const response = await axios.post(`${API_URL}/api/auth/firebase-login`, {
        firebaseToken,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email.split('@')[0]
      })

      // Save JWT token to localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        console.log('✅ JWT token saved to localStorage')
      }

      return response.data
    } catch (error) {
      console.error('Failed to get backend token:', error)
      // Even if backend fails, Firebase auth succeeded, so continue
    }
  }

  // Register new user with email and password
  const signup = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update user profile with name
      await updateProfile(userCredential.user, {
        displayName: name
      })

      // Get backend JWT token
      await getBackendToken(userCredential.user)

      return userCredential
    } catch (error) {
      throw error
    }
  }

  // Login with email and password
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      // Get backend JWT token
      await getBackendToken(userCredential.user)
      
      return userCredential
    } catch (error) {
      throw error
    }
  }

  // Login with Google
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      
      // Get backend JWT token
      await getBackendToken(result.user)
      
      return result
    } catch (error) {
      throw error
    }
  }

  // Logout
  const logout = () => {
    localStorage.removeItem('token')
    return signOut(auth)
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      
      // If user exists and no token in localStorage, get it
      if (currentUser && !localStorage.getItem('token')) {
        await getBackendToken(currentUser)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    user,
    signup,
    login,
    loginWithGoogle,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}