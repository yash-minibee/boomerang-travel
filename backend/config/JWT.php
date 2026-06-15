<?php

declare(strict_types=1);

class JWT
{
    private static function base64UrlEncode(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string
    {
        $padded = str_pad(strtr($data, '-_', '+/'), strlen($data) + (4 - strlen($data) % 4) % 4, '=');
        $decoded = base64_decode($padded, true);
        if ($decoded === false) {
            throw new RuntimeException('Invalid base64url encoding.');
        }
        return $decoded;
    }

    public static function encode(array $payload): string
    {
        $secret = Env::get('JWT_SECRET', '');
        if (empty($secret)) {
            throw new RuntimeException('JWT_SECRET is not configured.');
        }

        $header = self::base64UrlEncode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        $payload = self::base64UrlEncode(json_encode($payload));
        $signature = self::base64UrlEncode(
            hash_hmac('sha256', "{$header}.{$payload}", $secret, true)
        );

        return "{$header}.{$payload}.{$signature}";
    }

    public static function decode(string $token): array
    {
        $secret = Env::get('JWT_SECRET', '');
        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            throw new RuntimeException('Invalid token structure.');
        }

        [$header, $payload, $signature] = $parts;

        $expectedSig = self::base64UrlEncode(
            hash_hmac('sha256', "{$header}.{$payload}", $secret, true)
        );

        if (!hash_equals($expectedSig, $signature)) {
            throw new RuntimeException('Invalid token signature.');
        }

        $decoded = json_decode(self::base64UrlDecode($payload), true);
        if (!is_array($decoded)) {
            throw new RuntimeException('Invalid token payload.');
        }

        if (isset($decoded['exp']) && $decoded['exp'] < time()) {
            throw new RuntimeException('Token has expired.');
        }

        return $decoded;
    }
}
