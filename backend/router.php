<?php
// Router script for PHP built-in dev server.
// Usage: php -S localhost:8000 router.php
//
// This makes php -S behave like Apache with mod_rewrite —
// all requests (including OPTIONS preflight) go through index.php.

declare(strict_types=1);

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Serve real static files (uploads, etc.) directly
if ($uri !== '/' && file_exists(__DIR__ . $uri)) {
    return false; // let the built-in server serve it
}

// Everything else → index.php
require_once __DIR__ . '/index.php';
