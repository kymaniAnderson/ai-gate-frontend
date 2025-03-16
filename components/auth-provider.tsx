"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type UserRole = "resident" | "security" | "admin" | null
type User = {
  id: string
  name: string
  email: string
  role: UserRole
} | null

type AuthContextType = {
  user: User
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      // Simulating authentication for demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUsers = {
        resident: { id: "r1", name: "John Resident", email, role: "resident" as const },
        security: { id: "s1", name: "Sam Security", email, role: "security" as const },
        admin: { id: "a1", name: "Alice Admin", email, role: "admin" as const },
      }

      const newUser = role ? mockUsers[role] : null

      if (newUser) {
        setUser(newUser)
        localStorage.setItem("user", JSON.stringify(newUser))
        return true
      }
      return false
    } catch (error) {
      console.error("Login failed:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

