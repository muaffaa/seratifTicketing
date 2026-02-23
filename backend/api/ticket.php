<?php
// backend/api/ticket.php
// GET /ticket/{uuid}  – returns PDF ticket for approved user

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/helpers.php';

// QR code library (installed via composer: vendor/tecnickcom/tcpdf and endroid/qr-code)
// Fallback: use Google Charts QR API if composer not available
// Load composer autoload from backend/vendor
require_once __DIR__ . '/../vendor/autoload.php';

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use TCPDF;

if (session_status() === PHP_SESSION_NONE) session_start();

require_once __DIR__ . '/../config/cors.php';
handle_cors();
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['success' => false, 'message' => 'Method not allowed.'], 405);
}

// Auth check: either user owns this UUID or admin
$is_admin = !empty($_SESSION['admin_id']);
$is_user  = !empty($_SESSION['user_id']);
if (!$is_admin && !$is_user) {
    json_response(['success' => false, 'message' => 'Unauthorized.'], 401);
}

// Parse UUID from URL: /ticket/{uuid}
$path_parts = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));
$uuid = end($path_parts);

if (!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $uuid)) {
    json_response(['success' => false, 'message' => 'Invalid ticket UUID.'], 400);
}

$pdo = Database::connect();
$stmt = $pdo->prepare('
    SELECT u.uuid, u.full_name, u.school_origin, u.email, p.status, p.approved_at
    FROM users u
    JOIN payments p ON p.user_id = u.id
    WHERE u.uuid = ? AND p.status = \'approved\'
    LIMIT 1
');
$stmt->execute([$uuid]);
$data = $stmt->fetch();

if (!$data) {
    json_response(['success' => false, 'message' => 'No approved ticket found for this UUID.'], 404);
}

// Ensure user can only access their own ticket (unless admin)
if ($is_user && !$is_admin) {
    if ($_SESSION['user_uuid'] !== $uuid) {
        json_response(['success' => false, 'message' => 'Access denied.'], 403);
    }
}

// ── Generate QR code PNG from admin participant URL ──────────────────────────
$base_url = getenv('APP_URL') ?: 'http://localhost:5173';
$qr_data = $base_url . '/admin/participant/' . $uuid;
$qr     = QrCode::create($qr_data)->setSize(200)->setMargin(10);
$writer = new PngWriter();
$result = $writer->write($qr);
$qr_png = $result->getString(); // binary PNG

// ── Generate PDF with TCPDF ─────────────────────────────────────────────────
$pdf = new TCPDF('P', 'mm', [100, 160], true, 'UTF-8', false);
$pdf->SetCreator('SERATIF 2026');
$pdf->SetAuthor('SERATIF 2026 Committee');
$pdf->SetTitle('E-Ticket SERATIF 2026');
$pdf->setPrintHeader(false);
$pdf->setPrintFooter(false);
$pdf->SetMargins(8, 8, 8);
$pdf->SetAutoPageBreak(false, 0);
$pdf->AddPage();

// Background
$pdf->SetFillColor(248, 250, 252);
$pdf->Rect(0, 0, 100, 160, 'F');

// Top accent bar
$pdf->SetFillColor(30, 58, 138);
$pdf->Rect(0, 0, 100, 18, 'F');

// Event Name
$pdf->SetFont('helvetica', 'B', 16);
$pdf->SetTextColor(255, 255, 255);
$pdf->SetXY(0, 3);
$pdf->Cell(100, 8, 'SERATIF 2026', 0, 1, 'C');

$pdf->SetFont('helvetica', '', 9);
$pdf->SetTextColor(186, 230, 253);
$pdf->SetXY(0, 11);
$pdf->Cell(100, 5, 'Inspirational Islamic Talkshow', 0, 1, 'C');

// Sub header
$pdf->SetFont('helvetica', 'B', 8);
$pdf->SetTextColor(30, 58, 138);
$pdf->SetXY(8, 22);
$pdf->Cell(84, 5, 'E - T I C K E T', 0, 1, 'C');

// Divider
$pdf->SetDrawColor(37, 99, 235);
$pdf->Line(8, 28, 92, 28);

// QR Code
$tmp_qr = tempnam(sys_get_temp_dir(), 'seratif_qr_') . '.png';
file_put_contents($tmp_qr, $qr_png);
$pdf->Image($tmp_qr, 25, 32, 50, 50, 'PNG');
@unlink($tmp_qr);

// Info section
$pdf->SetFont('helvetica', '', 7);
$pdf->SetTextColor(100, 116, 139);
$pdf->SetXY(8, 85);
$pdf->Cell(84, 4, 'Scan QR for verification', 0, 1, 'C');

// Divider
$pdf->Line(8, 90, 92, 90);

$pdf->SetFont('helvetica', 'B', 8);
$pdf->SetTextColor(15, 23, 42);
$pdf->SetXY(8, 94);
$pdf->Cell(35, 5, 'Full Name', 0, 0, 'L');
$pdf->SetFont('helvetica', '', 8);
$pdf->SetXY(40, 94);
$pdf->Cell(52, 5, ': ' . $data['full_name'], 0, 1, 'L');

$pdf->SetFont('helvetica', 'B', 8);
$pdf->SetXY(8, 101);
$pdf->Cell(35, 5, 'School / Origin', 0, 0, 'L');
$pdf->SetFont('helvetica', '', 8);
$pdf->SetXY(40, 101);
$pdf->MultiCell(52, 5, ': ' . $data['school_origin'], 0, 'L');

// Track Y position after MultiCell to avoid overlap when school name wraps
$currentY = $pdf->GetY() + 2;

$pdf->SetFont('helvetica', 'B', 8);
$pdf->SetXY(8, $currentY);
$pdf->Cell(35, 5, 'Ticket ID', 0, 0, 'L');
$pdf->SetFont('helvetica', '', 7);
$pdf->SetTextColor(71, 85, 105);
$pdf->SetXY(40, $currentY);
$pdf->Cell(52, 5, ': ' . strtoupper(substr($uuid, 0, 8)), 0, 1, 'L');

// Approved stamp area
$currentY = $currentY + 8;
$pdf->SetFont('helvetica', 'B', 7);
$pdf->SetTextColor(21, 128, 61);
$pdf->SetXY(8, $currentY);
$pdf->Cell(84, 5, '✓  VERIFIED & APPROVED', 0, 1, 'C');

// Bottom bar - always pinned to the bottom of the page
$pdf->SetFillColor(30, 58, 138);
$pdf->Rect(0, 145, 100, 15, 'F');
$pdf->SetFont('helvetica', '', 7);
$pdf->SetTextColor(186, 230, 253);
$pdf->SetXY(0, 149);
$pdf->Cell(100, 5, 'seratif2026.com  |  Presented by ROHIS Muhammad Al Fatih', 0, 1, 'C');

// Output - ensure no prior output buffers corrupt binary PDF
if (ob_get_length()) { @ob_end_clean(); }
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="SERATIF2026_Ticket_' . strtoupper(substr($uuid, 0, 8)) . '.pdf"');
echo $pdf->Output('SERATIF2026_Ticket.pdf', 'S');
exit;
