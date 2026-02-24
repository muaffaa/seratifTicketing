#!/bin/bash
set -e

echo "==> SERATIF Ticketing Backend - Docker Entrypoint"
echo "=================================================="

# 1. Dapatkan PORT dari environment variable (Railway menyuntikkan ini)
# Default ke 80 jika tidak ada (untuk development lokal)
PORT="${PORT:-80}"
echo "--> Using PORT: $PORT"

# 2. Update Apache configuration untuk listen ke port yang benar
echo "--> Configuring Apache to listen on port $PORT..."

# Update ports.conf - ganti semua Listen directive
sed -i "s/Listen .*/Listen $PORT/g" /etc/apache2/ports.conf

# Update virtual host configuration
sed -i "s/<VirtualHost \*:80>/<VirtualHost *:$PORT>/g" /etc/apache2/sites-available/000-default.conf
sed -i "s/:80>/:$PORT>/g" /etc/apache2/sites-available/000-default.conf

# 3. Konfigurasi Directory untuk mengizinkan .htaccess
echo "--> Enabling .htaccess overrides..."
sed -i 's/<Directory \/var\/www\/html>/&\n    AllowOverride All/g' /etc/apache2/apache2.conf
# Jika AllowOverride sudah ada, pastikan nilainya All
sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

# 4. Setup MPM Prefork (required untuk PHP dengan Apache)
echo "--> Configuring MPM prefork for PHP..."
a2dismod mpm_event 2>/dev/null || true
a2dismod mpm_worker 2>/dev/null || true
a2enmod mpm_prefork

# 5. Pastikan modul PHP enabled
echo "--> Ensuring PHP module is enabled..."
a2enmod php 2>/dev/null || true

# 6. Enable rewrite module untuk URL routing
echo "--> Enabling mod_rewrite..."
a2enmod rewrite

# 7. Buat direktori yang diperlukan
echo "--> Setting up directories..."
mkdir -p /var/www/html/uploads/payments
chown -R www-data:www-data /var/www/html/uploads
chmod -R 775 /var/www/html/uploads

# 8. Set ownership yang benar untuk semua file
chown -R www-data:www-data /var/www/html

# 9. Tampilkan konfigurasi untuk debugging
echo ""
echo "==> Apache Configuration:"
echo "    Ports.conf Listen directive:"
grep -i "listen" /etc/apache2/ports.conf | head -3
echo "    VirtualHost:"
grep -i "VirtualHost" /etc/apache2/sites-available/000-default.conf | head -3
echo ""

# 10. Start Apache dengan logging enabled
echo "==> Starting Apache on port $PORT..."
echo "=================================================="

# Jalankan Apache di foreground
exec apache2-foreground
