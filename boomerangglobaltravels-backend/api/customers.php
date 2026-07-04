<?php
// GET  /api/customers.php          → list (admin)
// GET  /api/customers.php?id=5     → show (admin)

declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

$id   = isset($_GET['id']) ? (int) $_GET['id'] : null;
$ctrl = new CustomerController();

match (true) {
    $method === 'GET' && $id === null => $ctrl->index(),
    $method === 'GET' && $id !== null => $ctrl->show($id),
    default => methodNotAllowed(),
};
