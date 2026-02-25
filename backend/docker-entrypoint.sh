#!/bin/bash
set -e

# Get PORT from Railway environment (default 8080)
export PORT="${PORT:-8080}"

echo "Configuring Apache for port $PORT"

# Update Apache configuration files
sed -i "s/Listen .*/Listen ${PORT}/g" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/g" /etc/apache2/sites-available/000-default.conf

# Set ServerName
if ! grep -q "^ServerName" /etc/apache2/apache2.conf; then
    echo "ServerName localhost" >> /etc/apache2/apache2.conf
fi

# =========================================================
# FIX MPM CONFLICTS (PENTING: JANGAN DIHAPUS)
# =========================================================
echo "Fixing MPM Configuration..."
# Hapus paksa konfigurasi mpm_event dan mpm_worker yang bikin crash
rm -f /etc/apache2/mods-enabled/mpm_event.load
rm -f /etc/apache2/mods-enabled/mpm_event.conf
rm -f /etc/apache2/mods-enabled/mpm_worker.load
rm -f /etc/apache2/mods-enabled/mpm_worker.conf

# Pastikan hanya mpm_prefork yang aktif (Wajib untuk PHP)
a2dismod mpm_event mpm_worker 2>/dev/null || true
a2enmod mpm_prefork
# =========================================================

# Setup directories and permissions
mkdir -p /var/www/uploads/payments
chown -R www-data:www-data /var/www/html
chmod -R 755 /var/www/html
chown -R www-data:www-data /var/www/uploads
chmod -R 775 /var/www/uploads/payments

echo "Starting Apache on port $PORT..."

# Start Apache in foreground
exec apache2-foreground
