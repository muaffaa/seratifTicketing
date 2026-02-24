FROM php:8.2-apache

# Install dependencies OS dan PHP extensions yang dibutuhkan (GD untuk QR/PDF, PDO untuk DB)
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    zip \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Konfigurasi GD dan install ekstensinya
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo pdo_mysql zip

# Aktifkan mod_rewrite Apache, dan pastikan hanya satu MPM yang aktif (fix: AH00534)
RUN a2dismod mpm_event mpm_worker || true \
    && a2enmod mpm_prefork \
    && a2enmod rewrite \
    && apachectl configtest

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory ke htdocs Apache
WORKDIR /var/www/html

# Copy semua file backend
COPY . /var/www/html/

# Install dependencies PHP via Composer
RUN composer install --no-dev --optimize-autoloader

# PENTING (Railway): Ubah port Apache default (80) menjadi nilai environment variable PORT
# Default PORT pada environment Railway otomatis disediakan


# Set permission yang benar untuk folder uploads supaya PHP bisa save file/gambar
RUN mkdir -p /var/www/html/uploads/payments \
    && chown -R www-data:www-data /var/www/html/uploads \
    && chmod -R 777 /var/www/html/uploads
