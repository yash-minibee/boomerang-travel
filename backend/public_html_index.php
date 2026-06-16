<?php

declare(strict_types=1);

// ── Point to backend folder ─────────────────────────────────────────────────
// dirname(__DIR__) = /home/u123456789/domains/api.yourdomain.com
// Go two levels up to reach account root, then into boomerang-backend
// Adjust 'boomerang-backend' to whatever folder name you uploaded to
$root = dirname(dirname(__DIR__)) . '/boomerang-backend';

require_once $root . '/config/Env.php';
Env::load($root . '/.env');

// ── Autoload all classes ───────────────────────────────────────────────────
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

// ── CORS (must be first) ────────────────────────────────────────────────────
CorsMiddleware::handle();

// ── Routes ─────────────────────────────────────────────────────────────────
require_once $root . '/routes/api.php';

// ── Request parsing ─────────────────────────────────────────────────────────
$method = strtoupper($_SERVER['REQUEST_METHOD']);
$uri    = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$uri    = rawurldecode($uri);

// Strip /api/v1 prefix
$prefix = '/api/v1';
if (str_starts_with($uri, $prefix)) {
    $uri = substr($uri, strlen($prefix));
}
$uri = '/' . trim($uri, '/');
if ($uri === '/') {
    $uri = '';
}

// ── Request body ────────────────────────────────────────────────────────────
$body        = [];
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';

if (str_contains($contentType, 'application/json')) {
    $raw  = file_get_contents('php://input');
    $body = json_decode($raw ?: '{}', true) ?? [];
} elseif (in_array($method, ['POST', 'PUT', 'PATCH'], true)) {
    $body = $_POST;
}

// ── Router ───────────────────────────────────────────────────────────────────
$routes  = getRoutes();
$matched = false;

foreach ($routes as [$routeMethod, $routePath, $controller, $action, $paramNames]) {
    $pattern = preg_replace('/:([a-z_]+)/', '([^/]+)', $routePath);
    $pattern = '@^' . $pattern . '$@';

    if ($routeMethod !== $method) continue;
    if (!preg_match($pattern, $uri, $matches)) continue;

    array_shift($matches);
    $params = array_combine($paramNames, $matches) ?: [];

    $ctrl = new $controller();
    $args = [];
    foreach ($paramNames as $name) {
        $val    = $params[$name];
        $args[] = ($name === 'id' || ctype_digit($val)) ? (int) $val : $val;
    }

    if (in_array($method, ['POST', 'PUT', 'PATCH'], true)) {
        $args[] = $body;
    }

    $ctrl->$action(...$args);
    $matched = true;
    break;
}

if (!$matched) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Route not found.']);
}
