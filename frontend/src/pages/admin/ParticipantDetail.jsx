import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function ParticipantDetail() {
  const { uuid } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchParticipant = async () => {
      try {
        const response = await fetch(`/validate/${uuid}`)
        const result = await response.json()
        setData(result)
        if (!result.success && result.status === 'not_found') {
          setError('Data tidak ditemukan')
        }
      } catch (err) {
        console.error('Error fetching participant:', err)
        setError('Gagal memuat data peserta')
      } finally {
        setLoading(false)
      }
    }

    fetchParticipant()
  }, [uuid])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-seratif-200 border-t-seratif-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Memuat data peserta...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="bg-white border-b p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/scan')}
              className="text-seratif-700 hover:text-seratif-800 font-medium"
            >
              ← Kembali
            </button>
            <h1 className="text-lg font-bold text-slate-900">Detail Peserta</h1>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <p className="text-slate-600 text-lg mb-6">{error || 'Data tidak ditemukan'}</p>
            <button
              onClick={() => navigate('/admin/scan')}
              className="bg-seratif-700 text-white px-6 py-2 rounded-lg hover:bg-seratif-800 transition-colors"
            >
              Scan Tiket Lain
            </button>
          </div>
        </div>
      </div>
    )
  }

  const status = data.status
  const participant = data.participant || {}

  // Status banner configuration
  const statusConfig = {
    approved: {
      bg: 'bg-green-500',
      icon: '✓',
      title: 'TIKET VALID',
      subtitle: 'Peserta boleh masuk',
      textColor: 'text-white',
    },
    pending: {
      bg: 'bg-amber-500',
      icon: '⏱',
      title: 'BELUM DIVERIFIKASI',
      subtitle: 'Pembayaran masih menunggu persetujuan',
      textColor: 'text-white',
    },
    rejected: {
      bg: 'bg-red-500',
      icon: '✗',
      title: 'TIKET DITOLAK',
      subtitle: 'Peserta tidak diizinkan masuk',
      textColor: 'text-white',
    },
    not_found: {
      bg: 'bg-slate-700',
      icon: '?',
      title: 'TIKET TIDAK DITEMUKAN',
      subtitle: 'UUID tidak terdaftar di sistem',
      textColor: 'text-white',
    },
  }

  const config = statusConfig[status] || statusConfig.not_found

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => navigate('/admin/scan')}
            className="text-seratif-700 hover:text-seratif-800 font-medium"
          >
            ← Scan Lain
          </button>
          <h1 className="text-lg font-bold text-slate-900">Detail Peserta</h1>
          <button
            onClick={() => navigate('/admin')}
            className="text-seratif-700 hover:text-seratif-800 font-medium text-sm"
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`${config.bg} ${config.textColor} py-8 text-center`}>
        <div className="text-6xl mb-3">{config.icon}</div>
        <h2 className="text-3xl font-bold mb-2">{config.title}</h2>
        <p className="text-lg opacity-90">{config.subtitle}</p>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 pb-32">
        {/* Participant Info Card */}
        {participant.full_name && (
          <div className="max-w-2xl mx-auto">
            {/* Name - Prominent */}
            <div className="bg-white rounded-lg p-6 mb-4 shadow-sm border-l-4 border-seratif-700">
              <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide mb-1">
                Nama Lengkap
              </p>
              <p className="text-2xl font-bold text-slate-900">{participant.full_name}</p>
            </div>

            {/* Info Grid */}
            <div className="space-y-3">
              {/* School */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">
                  Asal Sekolah
                </p>
                <p className="text-lg text-slate-800">{participant.school_origin}</p>
              </div>

              {/* Email */}
              {participant.email && (
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">
                    Email
                  </p>
                  <p className="text-lg text-slate-800 break-all">{participant.email}</p>
                </div>
              )}

              {/* Phone */}
              {participant.phone_number && (
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">
                    No. HP
                  </p>
                  <p className="text-lg text-slate-800">{participant.phone_number}</p>
                </div>
              )}

              {/* Ticket ID */}
              <div className="bg-slate-900 text-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">
                  Ticket ID
                </p>
                <p className="text-xl font-mono font-bold tracking-wide">
                  {participant.ticket_id}
                </p>
              </div>

              {/* Approved At (only for approved) */}
              {status === 'approved' && participant.approved_at && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-1">
                    Diverifikasi pada
                  </p>
                  <p className="text-lg text-green-900">{participant.approved_at}</p>
                </div>
              )}

              {/* Message for non-approved */}
              {data.message && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">{data.message}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 space-y-2">
        <button
          onClick={() => navigate('/admin/scan')}
          className="w-full bg-seratif-700 hover:bg-seratif-800 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          Scan Tiket Lain
        </button>
        <button
          onClick={() => navigate('/admin')}
          className="w-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold py-3 px-4 rounded-lg transition-colors"
        >
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  )
}
