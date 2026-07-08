<?php

declare(strict_types=1);

// Bootstrapping the environment
require_once __DIR__ . '/config/Env.php';
Env::load(__DIR__ . '/.env');

require_once __DIR__ . '/config/Database.php';

$apiUrl = 'https://api.frankfurter.dev/v1/latest?from=USD&to=AUD';

echo "[" . date('Y-m-d H:i:s') . "] Starting Frankfurter exchange rate sync...\n";

$response = null;
$httpCode = 0;
$error = '';

if (function_exists('curl_version')) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'BoomerangTravelExchangeRateSync/1.0');
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
} else {
    // Fallback to file_get_contents if curl is not enabled
    $opts = [
        'http' => [
            'method' => 'GET',
            'header' => "User-Agent: BoomerangTravelExchangeRateSync/1.0\r\n",
            'timeout' => 10
        ]
    ];
    $context = stream_context_create($opts);
    $response = @file_get_contents($apiUrl, false, $context);
    $httpCode = $response !== false ? 200 : 500;
    $error = $response === false ? 'file_get_contents failed' : '';
}

if ($response === false || $httpCode !== 200) {
    $msg = "Failed to fetch currency rate from Frankfurter API. HTTP Code: {$httpCode}. Error: {$error}";
    error_log($msg);
    echo "[" . date('Y-m-d H:i:s') . "] Error: {$msg}\n";
    exit(1);
}

$data = json_decode($response, true);
$rate = $data['rates']['AUD'] ?? null;

if ($rate === null) {
    $msg = "Invalid response structure from Frankfurter API: " . $response;
    error_log($msg);
    echo "[" . date('Y-m-d H:i:s') . "] Error: {$msg}\n";
    exit(1);
}

try {
    $db = Database::getInstance();
    $stmt = $db->prepare(
        "INSERT INTO currency_rates (currency, rate, updated_at)
         VALUES ('AUD', ?, CURRENT_TIMESTAMP)
         ON CONFLICT(currency) DO UPDATE SET rate = excluded.rate, updated_at = CURRENT_TIMESTAMP"
    );
    $stmt->execute([$rate]);
    echo "[" . date('Y-m-d H:i:s') . "] Successfully updated AUD rate to: {$rate}\n";
} catch (Exception $e) {
    $msg = "Database write failed: " . $e->getMessage();
    error_log($msg);
    echo "[" . date('Y-m-d H:i:s') . "] Error: {$msg}\n";
    exit(1);
}
