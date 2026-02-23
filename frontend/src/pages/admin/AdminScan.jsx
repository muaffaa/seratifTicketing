import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Html5QrcodeScanner } from 'html5-qrcode'

export default function AdminScan() {
  const navigate = useNavigate()
  const scannerRef = useRef(null)
  const [scanning, setScanning] = useState(true)
  const [status, setStatus] = useState('Menunggu scan...')
  const [torchAvailable, setTorchAvailable] = useState(false)
  const [torchOn, setTorchOn] = useState(false)

  useEffect(() => {
    let scannerInstance = null

    const initScanner = async () => {
      try {
        scannerInstance = new Html5QrcodeScanner(
          'qr-reader',
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1,
            disableFlip: false,
          },
          false
        )

        scannerInstance.render(
          (decodedText) => {
            handleScanSuccess(decodedText, scannerInstance)
          },
          (error) => {
            // Ignore scanning errors - continue scanning
          }
        )

        // Check if torch is available
        try {
          const cameras = await Html5QrcodeScanner.getCameras()
          if (cameras && cameras.length > 0) {
            setTorchAvailable(true)
          }
        } catch (err) {
          console.log('Torch not available')
        }
      } catch (error) {
        console.error('Failed to initialize scanner:', error)
        setStatus('Gagal membuka kamera')
      }
    }

    initScanner()

    return () => {
      if (scannerInstance) {
        scannerInstance.clear().catch(err => console.log('Cleanup error:', err))
      }
    }
  }, [])

  const handleScanSuccess = (decodedText, scannerInstance) => {
    setScanning(false)
    setStatus('QR Terdeteksi, memproses...')

    try {
      // Extract UUID from URL
      // URL format: http://localhost:5173/admin/participant/{uuid}
      const url = new URL(decodedText)
      const parts = url.pathname.split('/')
      const uuid = parts[parts.length - 1]

      // Validate UUID format
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid)) {
        // Stop scanner before navigating
        if (scannerInstance) {
          scannerInstance.clear()
        }
        navigate(`/admin/participant/${uuid}`)
      } else {
        setStatus('UUID tidak valid')
        setScanning(true)
      }
    } catch (error) {
      console.error('Error processing QR:', error)
      setStatus('Gagal memproses QR code')
      setScanning(true)
    }
  }

  const toggleTorch = async () => {
    try {
      if (torchOn) {
        await Html5QrcodeScanner.toggleTorch(false)
        setTorchOn(false)
      } else {
        await Html5QrcodeScanner.toggleTorch(true)
        setTorchOn(true)
      }
    } catch (error) {
      console.log('Torch control error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-seratif-900 px-4 py-4 border-b border-seratif-700">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin')}
            className="text-white hover:bg-seratif-800 p-2 rounded-lg transition-colors"
          >
            ←
          </button>
          <h1 className="text-white font-bold text-lg">Scan Tiket Peserta</h1>
        </div>
        <p className="text-seratif-200 text-sm mt-1">Arahkan kamera ke QR code tiket</p>
      </div>

      {/* Status Bar */}
      <div className="bg-seratif-800 px-4 py-3 text-center">
        <p className="text-seratif-100 text-sm font-medium">{status}</p>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {scanning ? (
            <div
              id="qr-reader"
              className="rounded-lg overflow-hidden border-4 border-seratif-500 shadow-lg"
              style={{
                background: '#000',
                aspectRatio: '1 / 1',
              }}
            />
          ) : (
            <div className="bg-slate-800 rounded-lg p-8 text-center border-4 border-slate-700">
              <p className="text-slate-300">Memproses scan...</p>
            </div>
          )}
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-seratif-900 px-4 py-4 border-t border-seratif-700 flex gap-3">
        {torchAvailable && (
          <button
            onClick={toggleTorch}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              torchOn
                ? 'bg-yellow-500 text-yellow-900 hover:bg-yellow-600'
                : 'bg-slate-700 text-white hover:bg-slate-600'
            }`}
          >
            {torchOn ? '💡 Lampu Nyala' : '💡 Nyalakan Lampu'}
          </button>
        )}
        <button
          onClick={() => navigate('/admin')}
          className="flex-1 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors"
        >
          Batal
        </button>
      </div>
    </div>
  )
}
