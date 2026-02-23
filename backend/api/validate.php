<?php
// backend/api/validate.php
// GET /validate/{uuid}  – PUBLIC endpoint for QR code validation
// Returns complete participant info for admin detail page or public validation

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/helpers.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');

// Only GET allowed
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['success' => false, 'message' => 'Method not allowed.'], 405);
}

// Parse UUID from URL: /validate/{uuid}
$path_parts = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));
$uuid = end($path_parts);

// Validate UUID format (UUID v4)
if (!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $uuid)) {
    json_response(['success' => false, 'status' => 'not_found', 'message' => 'Tiket tidak ditemukan'], 404);
}

try {
    $pdo = Database::connect();
    
    // Query to get participant data with payment status
    $stmt = $pdo->prepare('
        SELECT u.uuid, u.full_name, u.school_origin, u.email, u.phone_number, 
               p.status, p.approved_at
        FROM users u
        LEFT JOIN payments p ON p.user_id = u.id
        WHERE u.uuid = ?
        LIMIT 1
    ');
    $stmt->execute([$uuid]);
    $data = $stmt->fetch();

    if (!$data) {
        json_response([
            'success' => false,
            'status'  => 'not_found',
            'message' => 'Tiket tidak ditemukan'
        ], 404);
    }

    // Determine status
    $status = $data['status'] ?? 'not_registered'; // no payment record
    if ($status === 'not_registered' || $status === null) {
        json_response([
            'success' => true,
            'status'  => 'not_found',
            'message' => 'Peserta belum melakukan pembayaran',
            'participant' => [
                'full_name'   => $data['full_name'],
                'school_origin' => $data['school_origin']
            ]
        ], 200);
    }

    $ticket_id = strtoupper(substr($uuid, 0, 8));
    $approved_at = $data['approved_at'] ? date('d F Y H:i', strtotime($data['approved_at'])) : null;

    // Response based on payment status
    $base_response = [
        'success' => true,
        'status'  => $status, // 'approved' | 'pending' | 'rejected'
        'participant' => [
            'uuid'          => $uuid,
            'full_name'     => $data['full_name'],
            'school_origin' => $data['school_origin'],
            'email'         => $data['email'],
            'phone_number'  => $data['phone_number'],
            'ticket_id'     => $ticket_id
        ]
    ];

    // Add approved_at only if status is approved
    if ($status === 'approved' && $approved_at) {
        $base_response['participant']['approved_at'] = $approved_at;
    }

    // Add status message for non-approved statuses
    if ($status === 'pending') {
        $base_response['message'] = 'Pembayaran belum diverifikasi';
    } elseif ($status === 'rejected') {
        $base_response['message'] = 'Pembayaran ditolak';
    }

    json_response($base_response, 200);

} catch (Exception $e) {
    json_response([
        'success' => false,
        'status'  => 'error',
        'message' => 'Terjadi kesalahan saat memverifikasi tiket'
    ], 500);
}
