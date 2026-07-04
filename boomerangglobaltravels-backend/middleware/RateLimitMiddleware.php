<?php

declare(strict_types=1);

class RateLimitMiddleware
{
    public static function handle(): void
    {
        $ip      = self::getIp();
        $maxReq  = (int) Env::get('RATE_LIMIT_REQUESTS', 10);
        $window  = (int) Env::get('RATE_LIMIT_WINDOW', 60);
        $file    = sys_get_temp_dir() . '/rl_' . md5($ip) . '.json';
        $now     = time();

        $data = ['count' => 0, 'start' => $now];
        if (file_exists($file)) {
            $raw = file_get_contents($file);
            if ($raw !== false) {
                $decoded = json_decode($raw, true);
                if (is_array($decoded)) {
                    $data = $decoded;
                }
            }
        }

        if (($now - $data['start']) > $window) {
            $data = ['count' => 0, 'start' => $now];
        }

        $data['count']++;
        file_put_contents($file, json_encode($data), LOCK_EX);

        if ($data['count'] > $maxReq) {
            $retryAfter = $window - ($now - $data['start']);
            header("Retry-After: {$retryAfter}");
            Response::error('Too many requests. Please try again later.', 429);
        }
    }

    private static function getIp(): string
    {
        return $_SERVER['HTTP_X_FORWARDED_FOR']
            ?? $_SERVER['HTTP_CLIENT_IP']
            ?? $_SERVER['REMOTE_ADDR']
            ?? '0.0.0.0';
    }
}
