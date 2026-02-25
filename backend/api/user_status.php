<?php
// backend/api/user_status.php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/helpers.php';

if (session_status() === PHP_SESSION_NONE) session_start();

header('Content-Type: application/json');
$frontend_origin = getenv('FRONTEND_URL') ?: 'http://localhost:5173';
header("Access-Control-Allow-Origin: $frontend_origin");
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$session = require_user_auth();
$user_id = (int) $session['user_id'];

$pdo = Database::connect();

$user_stmt = $pdo->prepare('
    SELECT id, uuid, full_name, email, phone_number, address, school_origin, created_at
    FROM users WHERE id = ? LIMIT 1
');
$user_stmt->execute([$user_id]);
$user = $user_stmt->fetch();

$pay_stmt = $pdo->prepare('
    SELECT id, status, screenshot_path, created_at, approved_at
    FROM payments WHERE user_id = ? ORDER BY id DESC LIMIT 1
');
$pay_stmt->execute([$user_id]);
$payment = $pay_stmt->fetch();

json_response([
    'success' => true,
    'user'    => $user,
    'payment' => $payment ?: null,
]);
