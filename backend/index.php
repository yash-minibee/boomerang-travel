<?php

declare(strict_types=1);

// ── Bootstrap ──────────────────────────────────────────────────────────────
$root = __DIR__;

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
$body = [];
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';

if (str_contains($contentType, 'application/json')) {
    $raw  = file_get_contents('php://input');
    $body = json_decode($raw ?: '{}', true) ?? [];
} elseif (in_array($method, ['POST', 'PUT', 'PATCH'], true)) {
    $body = $_POST;
}

// ── Router ───────────────────────────────────────────────────────────────────
$routes = getRoutes();
$matched = false;

foreach ($routes as [$routeMethod, $routePath, $controller, $action, $paramNames]) {
    // Build regex from route pattern
    $pattern = preg_replace('/:([a-z_]+)/', '([^/]+)', $routePath);
    $pattern = '@^' . $pattern . '$@';

    if ($routeMethod !== $method) {
        continue;
    }

    if (!preg_match($pattern, $uri, $matches)) {
        continue;
    }

    // Extract captured param values
    array_shift($matches); // remove full match
    $params = array_combine($paramNames, $matches) ?: [];

    // Instantiate and call
    $ctrl = new $controller();

    // Build argument list based on method signature expectations
    $args = [];
    foreach ($paramNames as $name) {
        $val = $params[$name];
        // Cast numeric params to int, leave slugs and page as string
        if ($name === 'id' || ctype_digit($val)) {
            $args[] = (int) $val;
        } else {
            $args[] = $val;
        }
    }

    // Methods that need body
    $bodyMethods = ['POST', 'PUT', 'PATCH'];
    if (in_array($method, $bodyMethods, true)) {
        $args[] = $body;
    }

    $ctrl->$action(...$args);
    $matched = true;
    break;
}

if (!$matched) {
    http_response_code(404);
    echo json_encode([
        'success' => false,
        'message' => 'Route not found.',
    ]);
}
