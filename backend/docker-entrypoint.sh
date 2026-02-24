#!/bin/bash
set -e

# 1. Pastikan PORT ada, kalau tidak default ke 80
PORT=${PORT:-80}

echo "--> Mengatur Apache agar berjalan di Port: $PORT"

# 2. Ganti Port di konfigurasi Apache
sed -i "s/Listen 80/Listen $PORT/g" /etc/apache2/ports.conf
sed -i "s/:80/:$PORT/g" /etc/apache2/sites-available/000-default.conf

# 3. Bersihkan MPM yang bandel (Fix Error MPM)
echo "--> Membersihkan konfigurasi MPM..."
rm -f /etc/apache2/mods-enabled/mpm_event.load
rm -f /etc/apache2/mods-enabled/mpm_event.conf
rm -f /etc/apache2/mods-enabled/mpm_worker.load
rm -f /etc/apache2/mods-enabled/mpm_worker.conf

# 4. Aktifkan MPM Prefork (Wajib untuk PHP)
a2enmod mpm_prefork || true

echo "--> Menjalankan Apache..."
# 5. Jalankan Apache
exec apache2-foreground