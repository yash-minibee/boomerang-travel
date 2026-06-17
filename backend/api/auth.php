<?php
// POST /api/auth.php?action=login
// POST /api/auth.php?action=logout
// GET  /api/auth.php?action=me

declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

$action = $_GET['action'] ?? '';
$ctrl   = new AuthController();

match (true) {
    $method === 'POST' && $action === 'login'  => $ctrl->login($body),
    $method === 'POST' && $action === 'logout' => $ctrl->logout(),
    $method === 'GET'  && $action === 'me'     => $ctrl->me(),
    default => methodNotAllowed(),
};
