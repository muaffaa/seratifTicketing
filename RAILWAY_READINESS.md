# Railway Deployment Readiness

## Status Ringkas
Backend sekarang sudah lebih siap untuk Railway (Docker build context, port handling, CORS origin berbasis env, dan path uploads konsisten).

Frontend masih perlu dideploy sebagai service terpisah (Static Site/Node) dan dihubungkan ke backend URL production.

## Yang sudah dipastikan
- Dockerfile backend menyalin source dari folder `backend/` agar build dari root repo tetap valid.
- Upload path di container diarahkan ke `/var/www/uploads/payments` agar selaras dengan path runtime di PHP.
- Header CORS endpoint backend sekarang membaca `FRONTEND_URL`.

## Env var minimum di Railway
Backend service:
- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLDATABASE`
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `FRONTEND_URL` (domain frontend Railway)
- `APP_URL` (opsional, untuk URL basis QR/ticket)

Frontend service:
- `VITE_API_URL` (domain backend Railway)

## Checklist pre-deploy
- Import `database/schema.sql` ke MySQL Railway.
- Pastikan frontend dan backend ada di service terpisah.
- Set custom domain/railway domain untuk keduanya lalu update `FRONTEND_URL` dan `VITE_API_URL`.
