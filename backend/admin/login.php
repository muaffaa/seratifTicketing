<?php
// backend/admin/login.php

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
$username = sanitize($body['username'] ?? '');
$password = $body['password']           ?? '';

if (!$username || !$password) {
    json_response(['success' => false, 'message' => 'Username and password are required.'], 422);
}

$pdo  = Database::connect();
$stmt = $pdo->prepare('SELECT id, username, password_hash FROM admins WHERE username = ? LIMIT 1');
$stmt->execute([$username]);
$admin = $stmt->fetch();

if (!$admin || !password_verify($password, $admin['password_hash'])) {
    json_response(['success' => false, 'message' => 'Invalid credentials.'], 401);
}

session_regenerate_id(true);
$_SESSION['admin_id']   = $admin['id'];
$_SESSION['admin_name'] = $admin['username'];

json_response([
    'success'  => true,
    'message'  => 'Admin login successful.',
    'admin'    => ['id' => $admin['id'], 'username' => $admin['username']],
]);
