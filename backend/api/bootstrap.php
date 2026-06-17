<?php

declare(strict_types=1);

/**
 * Bootstrap — shared by all /api/*.php endpoint files.
 *
 * Folder layout on cPanel shared hosting:
 *
 *   /home/username/
 *     boomerang-backend/          ← uploaded backend folder (outside public_html)
 *       api/
 *         bootstrap.php           ← this file
 *         packages.php
 *         auth.php
 *         ...
 *       config/
 *       controllers/
 *       models/
 *       ...
 *       .env
 *
 *   public_html/
 *     boomerang-backend/          ← symlink OR copy of the api/ folder only
 *
 * If you uploaded the whole backend INTO public_html, just change $root to:
 *   $root = dirname(__DIR__);     ← one level up from /api/ = backend root
 */

// One level up from /api/ = the backend root folder
$root = dirname(__DIR__);

require_once $root . '/config/Env.php';
Env::load($root . '/.env');

// ── Autoload all classes ─────────────────────────────────────────────────────
$autoloadDirs = [
    $root . '/config',
    $root . '/helpers',
    $root . '/middleware',
    $root . '/models',
    $root . '/controllers',
];

spl_autoload_register(function (string $class) use ($autoloadDirs): void {
    foreach ($autoloadDirs as $dir) {
        $file = $dir . '/' . $class . '.php';
        if (file_exists($file)) {
            require_once $file;
            return;
        }
    }
});

// ── CORS — must run before any output ────────────────────────────────────────
CorsMiddleware::handle();

// ── Parse request ─────────────────────────────────────────────────────────────
$method      = strtoupper($_SERVER['REQUEST_METHOD']);
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$body        = [];

if (str_contains($contentType, 'application/json')) {
    $raw  = file_get_contents('php://input');
    $body = json_decode($raw ?: '{}', true) ?? [];
} elseif (in_array($method, ['POST', 'PUT', 'PATCH'], true)) {
    $body = $_POST;
}

// ── Reject unsupported HTTP methods ─────────────────────────────────────────
function methodNotAllowed(): void
{
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}
