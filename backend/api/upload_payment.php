<?php
// backend/api/upload_payment.php

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

$session = require_user_auth();
$user_id = (int) $session['user_id'];

$pdo = Database::connect();

// Check if user already has an approved or pending payment
$check = $pdo->prepare("SELECT id, status FROM payments WHERE user_id = ? ORDER BY id DESC LIMIT 1");
$check->execute([$user_id]);
$existing = $check->fetch();

if ($existing && $existing['status'] === 'approved') {
    json_response(['success' => false, 'message' => 'Your payment is already approved. Ticket available.'], 409);
}
if ($existing && $existing['status'] === 'pending') {
    json_response(['success' => false, 'message' => 'You already have a pending payment under review.'], 409);
}

// Validate uploaded file
if (empty($_FILES['screenshot'])) {
    json_response(['success' => false, 'message' => 'Payment screenshot is required.'], 422);
}

try {
    $ext = validate_payment_image($_FILES['screenshot']);
} catch (RuntimeException $e) {
    json_response(['success' => false, 'message' => $e->getMessage()], 422);
}

$upload_dir = __DIR__ . '/../../uploads/payments/';
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0775, true);
    @chmod($upload_dir, 0775);
}

$filename = generate_uuid() . '.' . $ext;
$dest     = $upload_dir . $filename;

if (!move_uploaded_file($_FILES['screenshot']['tmp_name'], $dest)) {
    json_response(['success' => false, 'message' => 'Failed to save file. Please try again.'], 500);
}

// Ensure uploaded file permissions are reasonable
@chmod($dest, 0644);

$relative_path = 'uploads/payments/' . $filename;

$stmt = $pdo->prepare('INSERT INTO payments (user_id, screenshot_path, status) VALUES (?, ?, \'pending\')');
$stmt->execute([$user_id, $relative_path]);

json_response([
    'success' => true,
    'message' => 'Payment proof uploaded. Awaiting admin approval.',
    'screenshot_path' => $relative_path,
]);
