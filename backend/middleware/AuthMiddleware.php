<?php

declare(strict_types=1);

class AuthMiddleware
{
    public static function handle(): array
    {
        $headers = getallheaders();
        $auth    = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        if (empty($auth) || !str_starts_with($auth, 'Bearer ')) {
            Response::unauthorized('Authorization token required.');
        }

        $token = substr($auth, 7);

        try {
            $payload = JWT::decode($token);
        } catch (RuntimeException $e) {
            Response::unauthorized($e->getMessage());
        }

        return $payload;
    }

    public static function requireRole(array $payload, string $role): void
    {
        if (($payload['role'] ?? '') !== $role) {
            Response::forbidden('Insufficient permissions.');
        }
    }
}
