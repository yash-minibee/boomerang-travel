<?php
// GET  /api/dashboard.php              → stats (admin)
// GET  /api/dashboard.php?view=revenue → revenue chart (admin)

declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

$view = $_GET['view'] ?? 'stats';
$ctrl = new DashboardController();

match (true) {
    $method === 'GET' && $view === 'revenue' => $ctrl->revenue(),
    $method === 'GET'                        => $ctrl->stats(),
    default => methodNotAllowed(),
};
