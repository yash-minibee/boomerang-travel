<?php

declare(strict_types=1);

class CorsMiddleware
{
    private static array $allowed = [
        'http://localhost:5173',       // Frontend dev
        'http://localhost:5174',       // Admin dev
        'https://boomerang-travel.vercel.app',  // Vercel production
        'https://boomerangglobaltravels.com',   // Custom production domain
        'https://www.boomerangglobaltravels.com', // Custom production domain with www
    ];

    public static function handle(): void
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        if (in_array($origin, self::$allowed, true)) {
            header("Access-Control-Allow-Origin: {$origin}");
        } else {
            header('Access-Control-Allow-Origin: https://boomerangglobaltravels.com');
        }

        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');
        header('Content-Type: application/json; charset=utf-8');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }
    }
}
