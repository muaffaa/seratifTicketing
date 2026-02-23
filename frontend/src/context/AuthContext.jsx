import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null)
  const [admin, setAdmin]       = useState(null)
  const [loading, setLoading]   = useState(true)

  const checkUserSession = useCallback(async () => {
    try {
      const res = await fetch('/user/status', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        if (data.success) setUser(data.user)
      }
    } catch {}
  }, [])

  useEffect(() => {
    // Restore from localStorage flags (session cookies handled by browser)
    const storedUser  = localStorage.getItem('seratif_user')
    const storedAdmin = localStorage.getItem('seratif_admin')
    if (storedUser)  setUser(JSON.parse(storedUser))
    if (storedAdmin) setAdmin(JSON.parse(storedAdmin))
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('seratif_user', JSON.stringify(userData))
  }

  const logout = async () => {
    await fetch('/auth/logout', { method: 'POST', credentials: 'include' })
    setUser(null)
    localStorage.removeItem('seratif_user')
  }

  const adminLogin = (adminData) => {
    setAdmin(adminData)
    localStorage.setItem('seratif_admin', JSON.stringify(adminData))
  }

  const adminLogout = () => {
    setAdmin(null)
    localStorage.removeItem('seratif_admin')
  }

  return (
    <AuthContext.Provider value={{ user, admin, loading, login, logout, adminLogin, adminLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
