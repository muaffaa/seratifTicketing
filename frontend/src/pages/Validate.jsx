import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function Validate() {
  const { uuid } = useParams()
  const [state, setState] = useState('loading') // loading | valid | invalid | error
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchValidation = async () => {
      try {
        const response = await fetch(`/validate/${uuid}`)
        const result = await response.json()

        if (result.success && result.status === 'approved') {
          setData(result.participant)
          setState('valid')
        } else {
          setData({
            status: result.status,
            message: result.message
          })
          setState('invalid')
        }
      } catch (error) {
        console.error('Validation error:', error)
        setState('error')
      }
    }

    if (uuid) {
      fetchValidation()
    }
  }, [uuid])

  // Loading state
  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <p className="text-seratif-700 font-bold text-lg">SERATIF 2026</p>
          </div>
          <div className="bg-white rounded-lg p-8 shadow-md">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 border-4 border-seratif-200 border-t-seratif-700 rounded-full animate-spin"></div>
            </div>
            <p className="text-slate-600 text-lg">Memverifikasi tiket...</p>
          </div>
        </div>
      </div>
    )
  }

  // Valid state
  if (state === 'valid' && data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full animate-fadeIn">
          {/* Header */}
          <div className="mb-6 text-center">
            <p className="text-seratif-700 font-bold text-lg">SERATIF 2026</p>
            <p className="text-slate-500 text-sm mt-1">Inspirational Islamic Talkshow</p>
          </div>

          {/* Valid Card */}
          <div className="bg-green-50 border-2 border-green-300 rounded-lg overflow-hidden shadow-lg animate-slideUp">
            {/* Top accent */}
            <div className="bg-green-500 h-2"></div>

            {/* Content */}
            <div className="p-8 text-center">
            {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              {/* Heading */}
              <h1 className="text-3xl font-bold text-green-800 mb-6">TIKET VALID</h1>

              {/* Participant Name */}
              <div className="mb-8">
                <p className="text-2xl font-bold text-slate-800">{data.full_name}</p>
              </div>

              {/* Details */}
              <div className="space-y-4 text-left bg-white rounded p-4 mb-6">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Asal Sekolah</p>
                  <p className="text-lg text-slate-800 font-medium">{data.school_origin}</p>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Nomor Tiket</p>
                  <p className="text-lg font-mono text-seratif-700 font-bold">{data.ticket_id}</p>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Disetujui</p>
                  <p className="text-sm text-slate-700">{data.approved_at}</p>
                </div>
              </div>

              {/* Status badge */}
              <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                ✓ Terverifikasi & Disetujui
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-100 px-8 py-4 text-center text-xs text-slate-600">
              seratif2026.com | Presented by SERATIF Committee
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Invalid state
  if (state === 'invalid' && data) {
    const statusMessages = {
      not_found: 'Tiket tidak ditemukan dalam sistem.',
      pending: 'Tiket masih menunggu persetujuan panitia.',
      rejected: 'Tiket telah ditolak oleh panitia.',
      invalid: 'Tiket tidak valid.'
    }

    const message = data.message || statusMessages[data.status] || 'Tiket tidak valid.'

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full animate-fadeIn">
          {/* Header */}
          <div className="mb-6 text-center">
            <p className="text-seratif-700 font-bold text-lg">SERATIF 2026</p>
            <p className="text-slate-500 text-sm mt-1">Inspirational Islamic Talkshow</p>
          </div>

          {/* Invalid Card */}
          <div className="bg-red-50 border-2 border-red-300 rounded-lg overflow-hidden shadow-lg animate-slideUp">
            {/* Top accent */}
            <div className="bg-red-500 h-2"></div>

            {/* Content */}
            <div className="p-8 text-center">
            {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>

              {/* Heading */}
              <h1 className="text-3xl font-bold text-red-800 mb-6">TIKET TIDAK VALID</h1>

              {/* Message */}
              <div className="bg-white rounded p-4 mb-6">
                <p className="text-slate-800 text-lg font-medium">{message}</p>
              </div>

              {/* Status badge */}
              <div className="inline-block bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold">
                ✗ Verifikasi Gagal
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-100 px-8 py-4 text-center text-xs text-slate-600">
              seratif2026.com | Presented by SERATIF Committee
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="mb-6 text-center">
          <p className="text-seratif-700 font-bold text-lg">SERATIF 2026</p>
          <p className="text-slate-500 text-sm mt-1">Inspirational Islamic Talkshow</p>
        </div>

        {/* Error Card */}
        <div className="bg-white rounded-lg p-8 shadow-md border-2 border-slate-200">
          <div className="text-center">
            <p className="text-slate-600 text-lg mb-6">Tidak dapat terhubung ke server</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-seratif-700 hover:bg-seratif-800 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
