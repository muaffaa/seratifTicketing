import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const STATUS_CONFIG = {
  pending: { label: 'Menunggu Verifikasi', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  approved: { label: 'Disetujui ✓', color: 'bg-green-100 text-green-700 border-green-200' },
  rejected: { label: 'Ditolak', color: 'bg-red-100 text-red-700 border-red-200' },
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [payment, setPayment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [uploadErr, setUploadErr] = useState('')
  const fileRef = useRef()

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    fetch(`${apiUrl}/user/status`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setProfile(data.user)
          setPayment(data.payment)
          // Load the saved payment image if it exists
          if (data.payment?.screenshot_path) {
            setImagePreview(`${apiUrl}/` + data.payment.screenshot_path)
          }
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const uploadPayment = async (e) => {
    e.preventDefault()
    setUploadErr('')
    setUploadMsg('')
    const file = fileRef.current.files[0]
    if (!file) { setUploadErr('Pilih file terlebih dahulu.'); return }
    const fd = new FormData()
    fd.append('screenshot', file)
    setUploading(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiUrl}/upload-payment`, {
        method: 'POST',
        credentials: 'include',
        body: fd,
      })
      const data = await res.json()
      if (data.success) {
        setUploadMsg(data.message)
        // Use server path for persistence, fallback to blob URL for immediate preview
        setImagePreview(`${apiUrl}/` + (data.screenshot_path || URL.createObjectURL(file)))
        setPayment({ status: 'pending', created_at: new Date().toISOString() })
      } else {
        setUploadErr(data.message || 'Upload gagal.')
      }
    } catch {
      setUploadErr('Tidak dapat terhubung ke server.')
    } finally {
      setUploading(false)
    }
  }

  const downloadTicket = () => {
    window.open(`/ticket/${profile.uuid}`, '_blank')
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-seratif-200 border-t-seratif-700 rounded-full animate-spin" />
    </div>
  )

  const paymentStatus = payment?.status

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-seratif-900">
              Assalamu'alaikum, {profile?.full_name?.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">Dashboard Peserta SERATIF 2026</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary text-sm w-full sm:w-auto">
            Keluar
          </button>
        </div>

        {/* Status card */}
        <div className={`rounded-lg sm:rounded-2xl p-4 sm:p-6 mb-6 border ${paymentStatus === 'approved' ? 'bg-green-50 border-green-200' :
          paymentStatus === 'pending' ? 'bg-amber-50 border-amber-200' :
            paymentStatus === 'rejected' ? 'bg-red-50 border-red-200' :
              'bg-seratif-50 border-seratif-200'
          }`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Status Pembayaran</div>
              {paymentStatus ? (
                <span className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full border ${STATUS_CONFIG[paymentStatus].color}`}>
                  {STATUS_CONFIG[paymentStatus].label}
                </span>
              ) : (
                <span className="text-slate-500 text-sm">Belum ada pembayaran</span>
              )}
            </div>
            {paymentStatus === 'approved' && (
              <button onClick={downloadTicket} className="btn-primary gap-2 w-full sm:w-auto text-xs sm:text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                Download E-Ticket
              </button>
            )}
          </div>

          {paymentStatus === 'approved' && (
            <div className="mt-4 text-green-700 text-xs sm:text-sm">
              🎉 Pembayaran Anda telah diverifikasi. Silakan download e-ticket PDF Anda di atas.
            </div>
          )}
          {paymentStatus === 'pending' && (
            <div className="mt-4 text-amber-700 text-xs sm:text-sm">
              Bukti pembayaran Anda sedang ditinjau oleh admin. Harap tunggu konfirmasi.
            </div>
          )}
          {paymentStatus === 'rejected' && (
            <div className="mt-4 text-red-700 text-xs sm:text-sm">
              Pembayaran Anda ditolak. Silakan upload ulang bukti pembayaran yang valid.
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Profile Info */}
          <div className="card">
            <h2 className="font-display text-base sm:text-lg font-semibold text-seratif-900 mb-4 sm:mb-5">Informasi Peserta</h2>
            <div className="space-y-2 sm:space-y-3">
              {[
                { label: 'Nama Lengkap', value: profile?.full_name },
                { label: 'Email', value: profile?.email },
                { label: 'No. HP', value: profile?.phone_number },
                { label: 'Asal Sekolah', value: profile?.school_origin },
                { label: 'Alamat', value: profile?.address },
                { label: 'Ticket ID', value: profile?.uuid ? profile.uuid.split('-')[0].toUpperCase() : '—' },
              ].map(row => (
                <div key={row.label} className="flex gap-2 sm:gap-3">
                  <span className="text-xs font-medium text-slate-400 w-24 sm:w-28 shrink-0 mt-0.5">{row.label}</span>
                  <span className="text-xs sm:text-sm text-slate-700 break-words">{row.value || '—'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Upload */}
          <div className="card">
            <h2 className="font-display text-base sm:text-lg font-semibold text-seratif-900 mb-2">Upload Bukti Pembayaran</h2>
            <p className="text-slate-500 text-xs mb-4 sm:mb-5">
              Transfer ke: <strong className="text-seratif-700 block sm:inline">BSI 3908237660</strong>
              <br />a.n Arif Purnomo · Nominal: <strong className="text-seratif-700">Rp 12.000</strong>
            </p>

            {uploadMsg && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-3 py-2 text-xs mb-4">
                {uploadMsg}
              </div>
            )}
            {uploadErr && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-xs mb-4">
                {uploadErr}
              </div>
            )}

            {/* Show uploaded image if exists */}
            {imagePreview && (
              <div className="mb-4">
                <img src={imagePreview} alt="Uploaded Preview" className="w-full rounded-lg border border-slate-200 shadow-sm max-h-40 object-cover" />
              </div>
            )}

            {(!paymentStatus || paymentStatus === 'rejected') ? (
              <form onSubmit={uploadPayment} className="space-y-3 sm:space-y-4">
                <div className="border-2 border-dashed border-seratif-200 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center hover:border-seratif-400 transition-colors cursor-pointer"
                  onClick={() => fileRef.current.click()}>
                  <svg className="w-6 sm:w-8 h-6 sm:h-8 text-seratif-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs sm:text-sm text-slate-600">Klik untuk pilih gambar</p>
                  <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP — max 5 MB</p>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) setImagePreview(URL.createObjectURL(file))
                  }} />
                </div>
                <button type="submit" className="btn-primary w-full text-xs sm:text-sm" disabled={uploading}>
                  {uploading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Mengupload...</>
                  ) : 'Upload Bukti Bayar'}
                </button>
              </form>
            ) : (
              <div className="text-center py-6 sm:py-8 text-slate-400">
                <svg className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs sm:text-sm">Bukti pembayaran sudah diterima</p>
              </div>
            )}
          </div>
        </div>

        {/* Event info strip */}
        <div className="mt-6 bg-seratif-800 rounded-lg sm:rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 text-white">
          <div>
            <div className="font-display font-semibold text-base sm:text-lg">SERATIF 2026</div>
            <div className="text-seratif-300 text-xs sm:text-sm">Sabtu, 7 Maret 2026 · 12.00 WIB</div>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-seratif-300 text-xs">Lokasi</div>
            <div className="text-xs sm:text-sm font-medium">SMKIT Ihsanul Fikri Mungkid</div>
          </div>
        </div>
      </main>
    </div>
  )
}
