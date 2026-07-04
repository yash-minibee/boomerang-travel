<?php

declare(strict_types=1);

class Response
{
    public static function success(mixed $data = null, string $message = 'OK', int $status = 200, ?array $pagination = null): void
    {
        http_response_code($status);
        $body = ['success' => true, 'message' => $message, 'data' => $data];
        if ($pagination !== null) {
            $body['pagination'] = $pagination;
        }
        echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function error(string $message, int $status = 400, array $errors = []): void
    {
        http_response_code($status);
        $body = ['success' => false, 'message' => $message];
        if (!empty($errors)) {
            $body['errors'] = $errors;
        }
        echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function notFound(string $message = 'Resource not found.'): void
    {
        self::error($message, 404);
    }

    public static function unauthorized(string $message = 'Unauthorized.'): void
    {
        self::error($message, 401);
    }

    public static function forbidden(string $message = 'Forbidden.'): void
    {
        self::error($message, 403);
    }
}
