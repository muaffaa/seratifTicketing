FROM php:8.2-apache

# Install system dependencies & dos2unix
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    zip \
    unzip \
    curl \
    dos2unix \
    && rm -rf /var/lib/apt/lists/*

# Configure and install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo pdo_mysql zip

# Enable Apache modules (Rewrite & Headers)
RUN a2enmod rewrite headers

# Copy composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy backend application files
COPY backend/ /var/www/html/

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Create uploads directory with proper permissions
RUN mkdir -p /var/www/uploads/payments \
    && chown -R www-data:www-data /var/www/uploads \
    && chmod -R 775 /var/www/uploads

# Configure Apache to allow .htaccess overrides
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# Copy the entrypoint script
COPY backend/docker-entrypoint.sh /usr/local/bin/

# Fix line endings (prevent Windows formatting error) & make executable
RUN dos2unix /usr/local/bin/docker-entrypoint.sh && \
    chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port (Documentation only)
EXPOSE 8080

# Set entrypoint
ENTRYPOINT ["docker-entrypoint.sh"]
