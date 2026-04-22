import { createContext, useContext, useState, useEffect } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth"
import { auth } from "../firebase.config"
import axios from "axios"
import API_URL from "../config"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const getBackendToken = async (firebaseUser) => {
    try {
      const firebaseToken = await firebaseUser.getIdToken(true)

      const response = await axios.post(`${API_URL}/api/auth/firebase-login`, {
        firebaseToken,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
      })

      if (response.data.token) {
        localStorage.setItem("token", response.data.token)
      }

      return response.data.token
    } catch (error) {
      console.error("Failed to get backend token:", error)
      return null
    }
  }

  const getToken = async () => {
    if (!auth.currentUser) {
      return localStorage.getItem("token")
    }

    try {
      const freshToken = await getBackendToken(auth.currentUser)
      return freshToken || localStorage.getItem("token")
    } catch (error) {
      console.error("getToken failed:", error)
      return localStorage.getItem("token")
    }
  }

  const signup = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      await updateProfile(userCredential.user, {
        displayName: name,
      })

      await getBackendToken(userCredential.user)

      return userCredential
    } catch (error) {
      throw error
    }
  }

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      await getBackendToken(userCredential.user)
      return userCredential
    } catch (error) {
      throw error
    }
  }

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      await getBackendToken(result.user)
      return result
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      localStorage.removeItem("token")
      localStorage.removeItem("resumeData")
      sessionStorage.removeItem("resumeData")

      if (auth.currentUser?.uid) {
        sessionStorage.removeItem(`resumeData_${auth.currentUser.uid}`)
        localStorage.removeItem(`resumeData_${auth.currentUser.uid}`)
      }

      await signOut(auth)
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)

      if (currentUser) {
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
    loading,
    getToken,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}