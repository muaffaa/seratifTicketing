# Panduan Deploy ke Railway (Step-by-Step)

Dokumen ini memandu dari kondisi repo saat ini sampai aplikasi live di Railway.

## 1) Arsitektur yang direkomendasikan
Gunakan **2 service** + **1 database**:
1. **MySQL** (Railway Database)
2. **Backend API** (Docker, dari repo ini)
3. **Frontend** (Static/Vite build)

---

## 2) Deploy MySQL
1. Di Railway, buat project baru.
2. Tambahkan **MySQL** service.
3. Catat env yang disediakan Railway:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLDATABASE`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`

### Import schema
Import file `database/schema.sql` ke database MySQL Railway (pakai Railway SQL editor atau tool eksternal seperti DBeaver/TablePlus).

---

## 3) Deploy Backend (service Docker)
1. Tambahkan service baru dari GitHub repo ini.
2. Railway akan membaca `railway.json` dan build via `backend/Dockerfile`.
3. Set environment variables backend:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLDATABASE`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `FRONTEND_URL` = URL frontend Railway (misal `https://frontend-production.up.railway.app`)
   - `APP_URL` = URL frontend untuk pembentukan link tiket (opsional tapi direkomendasikan)
4. Deploy dan cek endpoint health:
   - `GET /` harus mengembalikan JSON status API running.

---

## 4) Deploy Frontend (service static)
1. Tambahkan service frontend dari repo yang sama.
2. Set Root Directory ke `frontend`.
3. Build command: `npm ci && npm run build`
4. Start/deploy mode: static (output `dist`) atau gunakan preset Vite static dari Railway.
5. Set env frontend:
   - `VITE_API_URL` = URL backend Railway (misal `https://backend-production.up.railway.app`)

---

## 5) Verifikasi integrasi end-to-end
1. Buka frontend URL.
2. Coba register user.
3. Login user.
4. Upload bukti pembayaran.
5. Login admin dan validasi pembayaran.
6. Cek endpoint:
   - `/user/status`
   - `/admin/payments`
   - `/validate/{uuid}`

Jika gagal karena CORS, pastikan `FRONTEND_URL` tepat (tanpa typo domain/protokol).

---

## 6) Troubleshooting cepat
- **500 Database environment variables not set**
  - Backend env MySQL belum lengkap.
- **CORS blocked**
  - `FRONTEND_URL` backend tidak cocok dengan domain frontend aktual.
- **Upload gagal**
  - Cek log backend dan pastikan deploy terbaru (path upload sudah disiapkan otomatis).
- **404 endpoint**
  - Pastikan URL API mengikuti route pada `backend/index.php`.
