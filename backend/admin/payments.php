<?php
// backend/admin/payments.php
// GET  /admin/payments        – list all payments
// POST /admin/approve         – approve/reject a payment

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

require_admin_auth();

$pdo = Database::connect();

// ── GET: list payments ──────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $rows = $pdo->query('
        SELECT
            p.id,
            p.status,
            p.screenshot_path,
            p.created_at,
            p.approved_at,
            u.id         AS user_id,
            u.uuid,
            u.full_name,
            u.email,
            u.school_origin,
            u.phone_number
        FROM payments p
        JOIN users u ON u.id = p.user_id
        ORDER BY p.created_at DESC
    ')->fetchAll();

    json_response(['success' => true, 'data' => $rows]);
}

// ── POST: approve or reject ─────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body       = json_decode(file_get_contents('php://input'), true);
    $payment_id = (int)   ($body['payment_id'] ?? 0);
    $action     = sanitize($body['action']     ?? '');  // 'approve' | 'reject'

    if (!$payment_id || !in_array($action, ['approve', 'reject'], true)) {
        json_response(['success' => false, 'message' => 'payment_id and action (approve|reject) required.'], 422);
    }

    $stmt = $pdo->prepare('SELECT id, status FROM payments WHERE id = ? LIMIT 1');
    $stmt->execute([$payment_id]);
    $payment = $stmt->fetch();

    if (!$payment) {
        json_response(['success' => false, 'message' => 'Payment not found.'], 404);
    }

    if ($payment['status'] !== 'pending') {
        json_response(['success' => false, 'message' => 'Only pending payments can be updated.'], 409);
    }

    $new_status  = $action === 'approve' ? 'approved' : 'rejected';
    $approved_at = $action === 'approve' ? date('Y-m-d H:i:s') : null;

    $update = $pdo->prepare('UPDATE payments SET status = ?, approved_at = ? WHERE id = ?');
    $update->execute([$new_status, $approved_at, $payment_id]);

    json_response([
        'success' => true,
        'message' => "Payment #$payment_id has been $new_status.",
    ]);
}

json_response(['success' => false, 'message' => 'Method not allowed.'], 405);
