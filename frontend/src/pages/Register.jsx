import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', confirm_password: '',
    phone_number: '', address: '', school_origin: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.full_name.trim())      e.full_name = 'Nama lengkap wajib diisi.'
    if (!form.email.trim())          e.email = 'Email wajib diisi.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Format email tidak valid.'
    if (form.password.length < 8)    e.password = 'Minimal 8 karakter.'
    if (form.password !== form.confirm_password) e.confirm_password = 'Konfirmasi password tidak cocok.'
    if (!form.phone_number.trim())   e.phone_number = 'Nomor HP wajib diisi.'
    if (!form.address.trim())        e.address = 'Alamat wajib diisi.'
    if (!form.school_origin.trim())  e.school_origin = 'Asal sekolah/instansi wajib diisi.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return
    setLoading(true)
    try {
      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          full_name:     form.full_name,
          email:         form.email,
          password:      form.password,
          phone_number:  form.phone_number,
          address:       form.address,
          school_origin: form.school_origin,
        }),
      })
      const data = await res.json()
      if (data.success) {
        navigate('/login?registered=1')
      } else {
        setServerError(data.message || 'Registrasi gagal.')
      }
    } catch {
      setServerError('Tidak dapat terhubung ke server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Left panel - IMAGE */}
      <div className="hidden lg:flex flex-col justify-center items-center w-2/5 bg-linear-to-br from-seratif-900 to-seratif-800 p-12 overflow-hidden relative">
        <img 
          src="/images/a9067dc0-c0e0-4f43-b3c9-5476581ba579.jpeg" 
          alt="Register" 
          className="absolute inset-0 w-full h-full object-cover opacity-90 blur-sm"
        />
        <div className="absolute inset-0 bg-seratif-900/40" />
        <div className="relative z-10 text-center">
          <div className="font-display text-5xl font-bold text-sky-accent mb-2">SERATIF</div>
          <div className="font-display text-2xl text-white mb-1">2026</div>
          <div className="text-seratif-300 text-sm">Inspirational Islamic Talkshow</div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 overflow-y-auto">
        <div className="max-w-lg w-full mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-seratif-600 text-sm mb-8 hover:underline">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Beranda
          </Link>

          <h1 className="font-display text-3xl font-bold text-seratif-900 mb-1">Daftar Peserta</h1>
          <p className="text-slate-500 text-sm mb-8">Isi formulir di bawah untuk mendaftar SERATIF 2026</p>

          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-6">
              {serverError}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap *</label>
              <input className="input-seratif" placeholder="Nama Lengkap" value={form.full_name} onChange={set('full_name')} />
              {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
              <input type="email" className="input-seratif" placeholder="email@contoh.com" value={form.email} onChange={set('email')} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password *</label>
                <input type="password" className="input-seratif" placeholder="Min. 8 karakter" value={form.password} onChange={set('password')} />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Konfirmasi Password *</label>
                <input type="password" className="input-seratif" placeholder="Ulangi password" value={form.confirm_password} onChange={set('confirm_password')} />
                {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nomor HP *</label>
              <input className="input-seratif" placeholder="+62 8xx xxxx xxxx" value={form.phone_number} onChange={set('phone_number')} />
              {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Asal Sekolah / Instansi *</label>
              <input className="input-seratif" placeholder="SMA / Universitas / Instansi" value={form.school_origin} onChange={set('school_origin')} />
              {errors.school_origin && <p className="text-red-500 text-xs mt-1">{errors.school_origin}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Alamat *</label>
              <textarea className="input-seratif resize-none" rows={3} placeholder="Alamat lengkap Anda" value={form.address} onChange={set('address')} />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <button type="submit" className="btn-primary w-full py-4 text-base mt-2" disabled={loading}>
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Mendaftar...</>
              ) : 'Daftar Sekarang'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-seratif-600 font-medium hover:underline">Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
