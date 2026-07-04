<?php
// Diagnostic script — upload with your backend, visit it once to check, then DELETE it.
// URL: https://krishivlimo.com.au/boomerangglobaltravels-backend/api/check.php

header('Content-Type: application/json');

$root   = dirname(__DIR__);
$checks = [];

// PHP version
$checks['php_version']        = PHP_VERSION;
$checks['php_version_ok']     = version_compare(PHP_VERSION, '8.0.0', '>=');

// Required extensions
$checks['pdo_enabled']        = extension_loaded('pdo');
$checks['pdo_sqlite_enabled'] = extension_loaded('pdo_sqlite');
$checks['json_enabled']       = extension_loaded('json');
$checks['mbstring_enabled']   = extension_loaded('mbstring');

// File paths
$checks['root_path']          = $root;
$checks['env_exists']         = file_exists($root . '/.env');
$checks['env_readable']       = is_readable($root . '/.env');
$checks['storage_dir_exists'] = is_dir($root . '/storage');
$checks['storage_writable']   = is_writable($root . '/storage');
$checks['uploads_dir_exists'] = is_dir($root . '/uploads');
$checks['uploads_writable']   = is_writable($root . '/uploads');

// Try loading .env
if ($checks['env_exists'] && $checks['env_readable']) {
    $parsed = parse_ini_file($root . '/.env');
    $checks['env_parsed']   = $parsed !== false;
    $checks['db_path_raw']  = $parsed['DB_PATH'] ?? 'NOT SET';
    $checks['db_full_path'] = $root . '/' . ($parsed['DB_PATH'] ?? 'storage/database.sqlite');
    $checks['db_exists']    = file_exists($checks['db_full_path']);
    $checks['db_readable']  = is_readable($checks['db_full_path']);
}

// Try SQLite connection
if ($checks['pdo_sqlite_enabled'] && isset($checks['db_full_path'])) {
    try {
        $pdo = new PDO('sqlite:' . $checks['db_full_path']);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $tables = $pdo->query("SELECT name FROM sqlite_master WHERE type='table'")->fetchAll(PDO::FETCH_COLUMN);
        $checks['db_connection'] = 'OK';
        $checks['db_tables']     = $tables;
    } catch (Exception $e) {
        $checks['db_connection'] = 'FAILED: ' . $e->getMessage();
    }
}

// Overall pass/fail
$checks['all_ok'] = $checks['php_version_ok']
    && $checks['pdo_sqlite_enabled']
    && $checks['env_exists']
    && $checks['env_readable']
    && ($checks['db_connection'] ?? '') === 'OK';

echo json_encode($checks, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
