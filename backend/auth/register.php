<?php
// backend/auth/register.php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/helpers.php';

if (session_status() === PHP_SESSION_NONE) session_start();

header('Content-Type: application/json');
$frontend_origin = getenv('FRONTEND_URL') ?: 'http://localhost:5173';
header("Access-Control-Allow-Origin: $frontend_origin");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['success' => false, 'message' => 'Method not allowed.'], 405);
}

$body = json_decode(file_get_contents('php://input'), true);

$full_name     = sanitize($body['full_name']     ?? '');
$email         = sanitize($body['email']         ?? '');
$password      = $body['password']               ?? '';
$phone_number  = sanitize($body['phone_number']  ?? '');
$address       = sanitize($body['address']       ?? '');
$school_origin = sanitize($body['school_origin'] ?? '');

// Basic validation
if (!$full_name || !$email || !$password || !$phone_number || !$address || !$school_origin) {
    json_response(['success' => false, 'message' => 'All fields are required.'], 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['success' => false, 'message' => 'Invalid email address.'], 422);
}

if (strlen($password) < 8) {
    json_response(['success' => false, 'message' => 'Password must be at least 8 characters.'], 422);
}

$pdo = Database::connect();

// Check duplicate email
$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    json_response(['success' => false, 'message' => 'Email is already registered.'], 409);
}

$uuid          = generate_uuid();
$password_hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

$insert = $pdo->prepare('
    INSERT INTO users (uuid, full_name, email, password_hash, phone_number, address, school_origin)
    VALUES (?, ?, ?, ?, ?, ?, ?)
');
$insert->execute([$uuid, $full_name, $email, $password_hash, $phone_number, $address, $school_origin]);

json_response([
    'success' => true,
    'message' => 'Registration successful. Please log in.',
], 201);
