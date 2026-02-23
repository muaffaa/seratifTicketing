<?php
// backend/utils/helpers.php

declare(strict_types=1);

/**
 * Generate a UUID v4.
 */
function generate_uuid(): string
{
    $data = random_bytes(16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

/**
 * Send a JSON response and exit.
 */
function json_response(array $data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Sanitize a string to prevent XSS.
 */
function sanitize(string $value): string
{
    return htmlspecialchars(trim($value), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/**
 * Validate uploaded payment screenshot.
 * Returns the file extension on success, or throws RuntimeException.
 */
function validate_payment_image(array $file): string
{
    $allowed_mime  = ['image/jpeg', 'image/png', 'image/webp'];
    $max_size_bytes = 5 * 1024 * 1024; // 5 MB

    if ($file['error'] !== UPLOAD_ERR_OK) {
        throw new RuntimeException('File upload error.');
    }

    if ($file['size'] > $max_size_bytes) {
        throw new RuntimeException('File exceeds maximum allowed size of 5 MB.');
    }

    // Use finfo for reliable MIME detection (not client-supplied type).
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime  = $finfo ? finfo_file($finfo, $file['tmp_name']) : false;
    finfo_close($finfo);

    if ($mime === false) {
        throw new RuntimeException('Unable to detect file MIME type.');
    }

    if (!in_array($mime, $allowed_mime, true)) {
        throw new RuntimeException('Invalid file type. Only JPEG, PNG and WebP are accepted.');
    }

    return match($mime) {
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
    };
}

/**
 * Require authenticated user session or abort.
 */
function require_user_auth(): array
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    if (empty($_SESSION['user_id'])) {
        json_response(['success' => false, 'message' => 'Unauthorized.'], 401);
    }
    return $_SESSION;
}

/**
 * Require authenticated admin session or abort.
 */
function require_admin_auth(): array
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    if (empty($_SESSION['admin_id'])) {
        json_response(['success' => false, 'message' => 'Admin access required.'], 403);
    }
    return $_SESSION;
}
