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

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Register new user with email and password
  const signup = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update user profile with name
      await updateProfile(userCredential.user, {
        displayName: name
      })

      return userCredential
    } catch (error) {
      throw error
    }
  }

  // Login with email and password
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  // Login with Google
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      return result
    } catch (error) {
      throw error
    }
  }

  // Logout
  const logout = () => {
    return signOut(auth)
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
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