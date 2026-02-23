import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const registered = params.get('registered') === '1'

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Email dan password wajib diisi.')
      return
    }
    setLoading(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        login(data.user)
        navigate('/dashboard')
      } else {
        setError(data.message || 'Login gagal.')
      }
    } catch {
      setError('Tidak dapat terhubung ke server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-5xl">
        <div className="">
          {/* ── LEFT: IMAGE ──────────────────────────────────────────────── */}
          {/* <div className="hidden md:block">
            <img 
              src="/images/a9067dc0-c0e0-4f43-b3c9-5476581ba579.jpeg" 
              alt="Login" 
              className="w-full h-auto rounded-3xl shadow-2xl object-cover"
            />
          </div> */}

          {/* ── RIGHT: FORM ──────────────────────────────────────────────── */}
          <div className="w-full">
            <div className="text-center mb-8">
              <Link to="/" className="inline-block">
                <div className="w-14 h-14 rounded-2xl bg-seratif-800 flex items-center justify-center mx-auto mb-4">
                  <span className="font-display text-2xl font-bold text-white">S</span>
                </div>
              </Link>
              <h1 className="font-display text-3xl font-bold text-seratif-900">Masuk ke Akun</h1>
              <p className="text-slate-500 text-sm mt-2">SERATIF 2026 — Peserta Portal</p>
            </div>

            {registered && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm mb-6 text-center">
                ✓ Registrasi berhasil! Silakan masuk dengan akun Anda.
              </div>
            )}

            <div className="card shadow-sm">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-5">
                  {error}
                </div>
              )}

              <form onSubmit={submit} className="space-y-4" noValidate>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    className="input-seratif"
                    placeholder="email@contoh.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                  <input
                    type="password"
                    className="input-seratif"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  />
                </div>

                <button type="submit" className="btn-primary w-full py-4 text-base" disabled={loading}>
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Masuk...</>
                  ) : 'Masuk'}
                </button>
              </form>
            </div>

            <p className="text-center text-slate-500 text-sm mt-6">
              Belum punya akun?{' '}
              <Link to="/register" className="text-seratif-600 font-medium hover:underline">Daftar di sini</Link>
            </p>

            <p className="text-center mt-4">
              <Link to="/admin/login" className="text-slate-400 text-xs hover:text-slate-600 transition-colors">
                Admin Login →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
