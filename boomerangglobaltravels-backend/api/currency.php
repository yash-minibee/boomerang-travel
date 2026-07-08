<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

try {
    $db = Database::getInstance();
    $stmt = $db->prepare('SELECT rate, updated_at FROM currency_rates WHERE currency = ? LIMIT 1');
    $stmt->execute(['AUD']);
    $row = $stmt->fetch();

    if ($row) {
        Response::success([
            'rate' => (float)$row['rate'],
            'updated_at' => $row['updated_at']
        ]);
    }
} catch (Exception $e) {
    error_log('API currency fetch failed: ' . $e->getMessage());
}

// Fallback response if DB rate not found
Response::success([
    'rate' => 1.0,
    'updated_at' => date('Y-m-d H:i:s')
]);
