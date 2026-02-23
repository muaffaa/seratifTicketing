<?php
// backend/auth/login.php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/helpers.php';

if (session_status() === PHP_SESSION_NONE) session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['success' => false, 'message' => 'Method not allowed.'], 405);
}

$body     = json_decode(file_get_contents('php://input'), true);
$email    = sanitize($body['email']    ?? '');
$password = $body['password']          ?? '';

if (!$email || !$password) {
    json_response(['success' => false, 'message' => 'Email and password are required.'], 422);
}

$pdo  = Database::connect();
$stmt = $pdo->prepare('SELECT id, uuid, full_name, password_hash FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    json_response(['success' => false, 'message' => 'Invalid email or password.'], 401);
}

// Regenerate session ID to prevent fixation
session_regenerate_id(true);
$_SESSION['user_id']   = $user['id'];
$_SESSION['user_uuid'] = $user['uuid'];
$_SESSION['user_name'] = $user['full_name'];

json_response([
    'success'   => true,
    'message'   => 'Login successful.',
    'user'      => [
        'id'        => $user['id'],
        'uuid'      => $user['uuid'],
        'full_name' => $user['full_name'],
    ],
]);
