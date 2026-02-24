<?php
declare(strict_types=1);

class Database
{
    private static ?PDO $instance = null;

    public static function connect(): PDO
    {
        if (self::$instance !== null) {
            return self::$instance;
        }

        $host    = getenv('MYSQLHOST');
        $dbname  = getenv('MYSQLDATABASE') ?: 'railway';
        $user    = getenv('MYSQLUSER');
        $pass    = getenv('MYSQLPASSWORD');
        $port    = getenv('MYSQLPORT') ?: '3306';
        $charset = 'utf8mb4';

        if (!$host || !$dbname || !$user) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database environment variables not set.'
            ]);
            exit;
        }

        $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            self::$instance = new PDO($dsn, $user, $pass, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database connection failed.'
            ]);
            exit;
        }

        return self::$instance;
    }
}