"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { authAPI } from "../api/auth.api"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem("access_token")
    if (token) {
      try {
        const userData = await authAPI.getCurrentUser()
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Auth check failed:", error)
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        setIsAuthenticated(false)
      }
    }
    setLoading(false)
  }

  const login = async (credentials) => {
    try {
      const data = await authAPI.login(credentials)
      const userData = await authAPI.getCurrentUser()
      setUser(userData)
      setIsAuthenticated(true)
      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      }
    }
  }

  const register = async (userData) => {
    try {
      const data = await authAPI.register(userData)
      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      }
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
    }
  }

  const updateUser = async (userData) => {
    try {
      const updatedUser = await authAPI.updateProfile(userData)
      setUser(updatedUser)
      return { success: true, data: updatedUser }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Update failed",
      }
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
