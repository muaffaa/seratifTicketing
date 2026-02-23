import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const STATUS_BADGE = {
  pending:  'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

export default function AdminPanel() {
  const { admin, adminLogout } = useAuth()
  const navigate = useNavigate()
  const [payments, setPayments] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')
  const [processing, setProcessing] = useState(null)
  const [viewImg, setViewImg]   = useState(null)

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const res  = await fetch('/admin/payments', { credentials: 'include' })
      const data = await res.json()
      if (data.success) setPayments(data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPayments() }, [])

  const handleAction = async (paymentId, action) => {
    setProcessing(paymentId + action)
    try {
      const res = await fetch('/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ payment_id: paymentId, action }),
      })
      const data = await res.json()
      if (data.success) {
        setPayments(prev => prev.map(p =>
          p.id === paymentId
            ? { ...p, status: action === 'approve' ? 'approved' : 'rejected', approved_at: action === 'approve' ? new Date().toISOString() : null }
            : p
        ))
      }
    } finally {
      setProcessing(null)
    }
  }

  const handleLogout = () => {
    adminLogout()
    navigate('/admin/login')
  }

  const filtered = filter === 'all' ? payments : payments.filter(p => p.status === filter)

  const counts = {
    all:      payments.length,
    pending:  payments.filter(p => p.status === 'pending').length,
    approved: payments.filter(p => p.status === 'approved').length,
    rejected: payments.filter(p => p.status === 'rejected').length,
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Top bar */}
      <div className="bg-seratif-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-seratif-700 flex items-center justify-center">
            <span className="font-display font-bold text-sm">S</span>
          </div>
          <span className="font-display font-semibold">SERATIF 2026</span>
          <span className="text-seratif-400 text-sm">/ Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/admin/scan"
            className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            📱 Scan Tiket
          </Link>
          <span className="text-seratif-400 text-sm hidden md:block">Logged in as: <strong className="text-white">{admin?.username}</strong></span>
          <button onClick={handleLogout} className="text-sm text-seratif-400 hover:text-white transition-colors">
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-seratif-900">Manajemen Pembayaran</h1>
          <p className="text-slate-500 text-sm mt-1">Tinjau dan verifikasi bukti pembayaran peserta</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { key: 'all',      label: 'Total',        color: 'text-seratif-700 bg-seratif-50 border-seratif-200' },
            { key: 'pending',  label: 'Menunggu',     color: 'text-amber-700 bg-amber-50 border-amber-200' },
            { key: 'approved', label: 'Disetujui',    color: 'text-green-700 bg-green-50 border-green-200' },
            { key: 'rejected', label: 'Ditolak',      color: 'text-red-700 bg-red-50 border-red-200' },
          ].map(s => (
            <button key={s.key}
              onClick={() => setFilter(s.key)}
              className={`card border text-left transition-all ${s.color} ${filter === s.key ? 'ring-2 ring-seratif-500' : ''}`}>
              <div className="text-2xl font-display font-bold">{counts[s.key]}</div>
              <div className="text-xs mt-1 font-medium">{s.label}</div>
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-seratif-200 border-t-seratif-700 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-16 text-slate-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Tidak ada data pembayaran
          </div>
        ) : (
          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['#', 'Peserta', 'Asal Sekolah', 'Bukti Bayar', 'Status', 'Tanggal', 'Aksi'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((p, i) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-seratif-900">{p.full_name}</div>
                        <div className="text-xs text-slate-400">{p.email}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{p.school_origin}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setViewImg(`/${p.screenshot_path}`)}
                          className="text-seratif-600 hover:underline text-xs flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Lihat
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_BADGE[p.status]}`}>
                          {p.status === 'pending' ? 'Menunggu' : p.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">
                        {new Date(p.created_at).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })}
                      </td>
                      <td className="px-4 py-3">
                        {p.status === 'pending' ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAction(p.id, 'approve')}
                              disabled={processing !== null}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50">
                              {processing === p.id + 'approve' ? '...' : 'Setujui'}
                            </button>
                            <button
                              onClick={() => handleAction(p.id, 'reject')}
                              disabled={processing !== null}
                              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50">
                              {processing === p.id + 'reject' ? '...' : 'Tolak'}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            {p.status === 'approved' ? 'Tiket tergenerate' : 'Ditolak'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Image preview modal */}
      {viewImg && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewImg(null)}>
          <div className="relative max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <img src={viewImg} alt="Bukti Bayar" className="w-full rounded-2xl shadow-2xl" />
            <button onClick={() => setViewImg(null)}
              className="absolute top-3 right-3 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70">
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
