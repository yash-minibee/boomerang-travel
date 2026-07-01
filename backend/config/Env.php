<?php

declare(strict_types=1);

class Env
{
    private static array $data = [];
    private static bool $loaded = false;

    public static function load(string $path): void
    {
        if (self::$loaded) {
            return;
        }
        if (!file_exists($path)) {
            throw new RuntimeException(".env file not found at: {$path}");
        }
        $parsed = parse_ini_file($path, false, INI_SCANNER_TYPED);
        if ($parsed === false) {
            throw new RuntimeException("Failed to parse .env file.");
        }
        self::$data = $parsed;
        self::$loaded = true;
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        return self::$data[$key] ?? $default;
    }
}