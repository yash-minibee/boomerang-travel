<?php

declare(strict_types=1);

class Sanitizer
{
    public static function string(mixed $value): string
    {
        return htmlspecialchars(strip_tags(trim((string) $value)), ENT_QUOTES, 'UTF-8');
    }

    public static function int(mixed $value): int
    {
        return (int) filter_var($value, FILTER_SANITIZE_NUMBER_INT);
    }

    public static function float(mixed $value): float
    {
        return (float) filter_var($value, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    }

    public static function email(mixed $value): string
    {
        return strtolower(trim((string) filter_var($value, FILTER_SANITIZE_EMAIL)));
    }

    public static function array(mixed $value): array
    {
        return is_array($value) ? $value : [];
    }

    public static function bool(mixed $value): bool
    {
        return filter_var($value, FILTER_VALIDATE_BOOLEAN);
    }
}
