# Seratif 2026

Sistem manajemen dan validasi tiket acara terintegrasi dengan panel admin dan portal pengguna.

## 🌟 Fitur Utama

- **Registrasi & Autentikasi**: Sistem login untuk pengguna dan admin
- **Manajemen Peserta**: Tracking data peserta dan detail mereka
- **Validasi Tiket**: QR code generation dan scanning untuk verifikasi peserta
- **Manajemen Pembayaran**: Upload dan validasi bukti pembayaran
- **Panel Admin**: Dashboard untuk scan tiket, manajemen peserta, dan monitoring pembayaran
- **Responsif**: Antarmuka yang responsif di desktop maupun mobile

## 📋 Prasyarat

- **Backend**: PHP 7.4+ dengan Composer
- **Frontend**: Node.js 16+ dan npm/yarn
- **Database**: MySQL 5.7+

## 🚀 Instalasi & Setup

### Backend Setup

```bash
cd backend
composer install

start backend api:
./start-backend.sh

atau pakai:
cd backend
php -S localhost:8000 -t .
```

**Environment Configuration:**
- Edit `backend/config/database.php` dengan kredensial database Anda
- Pastikan folder `backend/uploads/payments/` memiliki permission write

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

**Production Build:**
```bash
npm run build
```

## 📁 Struktur Proyek

```
seratif2026/
├── backend/                 # API & Logika Backend (PHP)
│   ├── api/                # Endpoint API
│   ├── admin/              # Halaman admin
│   ├── auth/               # Autentikasi
│   ├── config/             # Konfigurasi database
│   └── utils/              # Helper functions
├── frontend/               # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # Komponen reusable
│   │   ├── pages/          # Halaman utama & admin
│   │   ├── context/        # State management
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── database/               # Database schema
└── uploads/                # File uploads (payments, dll)
```

## 🔑 Endpoint API Utama

### Autentikasi
- `POST /api/auth/login` - Login pengguna
- `POST /api/auth/register` - Registrasi pengguna
- `POST /api/auth/logout` - Logout

### Peserta
- `GET /api/user_status` - Status user/peserta
- `GET /api/ticket` - Data tiket peserta

### Pembayaran
- `POST /api/upload_payment` - Upload bukti pembayaran
- `POST /api/validate` - Validasi pembayaran

### Admin
- `POST /admin/login` - Login admin
- `GET /admin/payments` - Daftar pembayaran
- `GET /admin/login` - Halaman login admin

## 🎨 Stack Teknologi

### Frontend
- React 18
- Vite
- React Router
- Context API

### Backend
- PHP 7.4+
- Composer
- QR Code: endroid/qr-code, bacon/bacon-qr-code
- TCPDF: untuk PDF generation
- MySQL

**Dibuat dengan ❤️ untuk Seratif 2026**
