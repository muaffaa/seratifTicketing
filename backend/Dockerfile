FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo pdo_mysql zip

# Aktifkan mod_rewrite untuk API
RUN a2enmod rewrite

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . /var/www/html/

RUN composer install --no-dev --optimize-autoloader

RUN mkdir -p /var/www/html/uploads/payments \
    && chown -R www-data:www-data /var/www/html/uploads \
    && chmod -R 775 /var/www/html/uploads

# ==========================================================
# FIX FINAL: Eksekusi command dalam 1 baris shell (sh -c)
# 1. Bersihkan modul MPM yang bentrok secara resmi (a2dismod)
# 2. Aktifkan mpm_prefork (a2enmod)
# 3. Ubah port ke $PORT Railway
# 4. Jalankan Apache
# ==========================================================
CMD ["sh", "-c", "a2dismod mpm_event mpm_worker || true; a2enmod mpm_prefork || true; sed -i \"s/Listen 80/Listen ${PORT}/g\" /etc/apache2/ports.conf; sed -i \"s/:80/:${PORT}/g\" /etc/apache2/sites-available/000-default.conf; apache2-foreground"]
