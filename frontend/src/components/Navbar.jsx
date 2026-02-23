import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ transparent = false }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const base = transparent
    ? 'fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md bg-white/10 border-b border-white/20'
    : 'sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-white/20 shadow-lg shadow-black/5'

  return (
    <nav className={base}>
      <div className={`max-w-6xl mx-auto px-6 py-3 flex items-center justify-between ${transparent ? 'text-white' : 'text-seratif-900'}`}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
          {/* Logo Icon */}
          <img src="/images/logo-rohis.png" alt="SERATIF Logo" className="w-12 h-12 rounded-xl shadow-lg shadow-seratif-900/30 group-hover:scale-105 transition-transform object-cover" />
          {/* Text */}
          <div className="flex flex-col leading-tight">
            <span className="font-display font-black text-lg tracking-tight">SERATIF</span>
            <span className="text-xs font-semibold opacity-75">2026</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {!user ? (
            <>
              <a href="#about"   className={`text-sm font-medium hover:opacity-70 transition-opacity ${transparent ? 'text-white/80' : 'text-slate-600'}`}>About</a>
              <a href="#speakers" className={`text-sm font-medium hover:opacity-70 transition-opacity ${transparent ? 'text-white/80' : 'text-slate-600'}`}>Speakers</a>
              <a href="#tickets"  className={`text-sm font-medium hover:opacity-70 transition-opacity ${transparent ? 'text-white/80' : 'text-slate-600'}`}>Tickets</a>
              <Link to="/login"    className={`text-sm font-medium hover:opacity-70 transition-opacity ${transparent ? 'text-white/80' : 'text-slate-600'}`}>Login</Link>
              <Link to="/register" className="btn-primary text-sm">Register Now</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className={`text-sm font-medium ${transparent ? 'text-white/80' : 'text-slate-600'}`}>Dashboard</Link>
              <span className={`text-sm ${transparent ? 'text-white/60' : 'text-slate-400'}`}>Hi, {user.full_name?.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn-secondary text-sm">Logout</button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          <div className="w-5 h-0.5 bg-current mb-1" />
          <div className="w-5 h-0.5 bg-current mb-1" />
          <div className="w-5 h-0.5 bg-current" />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden backdrop-blur-lg bg-white/80 border-t border-white/20 px-6 py-4 flex flex-col gap-4 shadow-lg shadow-black/5">
          {!user ? (
            <>
              <a href="#about"    className="text-sm text-slate-700" onClick={() => setOpen(false)}>About</a>
              <a href="#speakers" className="text-sm text-slate-700" onClick={() => setOpen(false)}>Speakers</a>
              <a href="#tickets"  className="text-sm text-slate-700" onClick={() => setOpen(false)}>Tickets</a>
              <Link to="/login"    className="text-sm text-slate-700">Login</Link>
              <Link to="/register" className="btn-primary text-sm text-center">Register Now</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-sm text-slate-700">Dashboard</Link>
              <button onClick={handleLogout} className="btn-secondary text-sm">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
