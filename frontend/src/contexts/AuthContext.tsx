'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  username: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string, role?: string) => Promise<void>
  logout: () => void
  token: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
      fetchUser(storedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async (token: string) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setUser(response.data.user)
    } catch (error) {
      localStorage.removeItem('token')
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email,
        password
      })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
      router.push('/')
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '登录失败')
    }
  }

  const register = async (username: string, email: string, password: string, role = 'customer') => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        username,
        email,
        password,
        role
      })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
      router.push('/')
    } catch (error: any) {
      throw new Error(error.response?.data?.message || '注册失败')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}



