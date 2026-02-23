<?php
// backend/config/cors.php

function handle_cors() {
    // Gunakan Environment Variable FRONTEND_URL jika ada, default ke localhost
    $env_origin = getenv('FRONTEND_URL') ?: 'http://localhost:5173';
    
    // Origin yang membuat request
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    // Daftar origin yang kita izinkan
    $allowed_origins = [
        $env_origin,
        'http://localhost:5173', // Lokal dev
        'http://localhost:4173'  // Lokal preview build
    ];
    
    // Jika origin ada dalam daftar yang diizinkan (atau gunakan fallback env)
    $cors_origin = in_array($origin, $allowed_origins) ? $origin : $env_origin;

    header("Access-Control-Allow-Origin: $cors_origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

    // Tangani preflight request dari Browser
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}
