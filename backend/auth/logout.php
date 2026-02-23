<?php
// backend/auth/logout.php

declare(strict_types=1);

require_once __DIR__ . '/../utils/helpers.php';

if (session_status() === PHP_SESSION_NONE) session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');

$_SESSION = [];
session_destroy();

json_response(['success' => true, 'message' => 'Logged out.']);
