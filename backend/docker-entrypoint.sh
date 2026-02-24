#!/bin/bash

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

# Setup directories and permissions
mkdir -p /var/www/html/uploads/payments
chown -R www-data:www-data /var/www/html
chmod -R 755 /var/www/html
chmod -R 775 /var/www/html/uploads/payments

echo "Starting Apache on port $PORT..."

# Start Apache in foreground
exec apache2-foreground
