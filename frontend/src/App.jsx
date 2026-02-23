import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing    from './pages/Landing'
import Register   from './pages/Register'
import Login      from './pages/Login'
import Dashboard  from './pages/Dashboard'
import AdminLogin from './pages/admin/AdminLogin'
import AdminPanel from './pages/admin/AdminPanel'
import AdminScan from './pages/admin/AdminScan'
import ParticipantDetail from './pages/admin/ParticipantDetail'
import Validate   from './pages/Validate'

function ProtectedUser({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen"><Spinner /></div>
  return user ? children : <Navigate to="/login" replace />
}

function ProtectedAdmin({ children }) {
  const { admin, loading } = useAuth()
  if (loading) return null
  return admin ? children : <Navigate to="/admin/login" replace />
}

function Spinner() {
  return (
    <div className="w-10 h-10 border-4 border-seratif-200 border-t-seratif-700 rounded-full animate-spin" />
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"             element={<Landing />} />
          <Route path="/register"     element={<Register />} />
          <Route path="/login"        element={<Login />} />
          <Route path="/dashboard"    element={<ProtectedUser><Dashboard /></ProtectedUser>} />
          <Route path="/admin/login"  element={<AdminLogin />} />
          <Route path="/admin"        element={<ProtectedAdmin><AdminPanel /></ProtectedAdmin>} />
          <Route path="/admin/scan"   element={<ProtectedAdmin><AdminScan /></ProtectedAdmin>} />
          <Route path="/admin/participant/:uuid" element={<ProtectedAdmin><ParticipantDetail /></ProtectedAdmin>} />
          <Route path="/validate/:uuid" element={<Validate />} />
          <Route path="*"             element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
