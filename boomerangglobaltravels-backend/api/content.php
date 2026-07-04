<?php
// GET  /api/content.php?page=home     → get page content (public)
// PUT  /api/content.php?page=home     → update page content (admin)
// Allowed pages: home | about | contact

declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

$page = $_GET['page'] ?? '';
$ctrl = new ContentController();

match (true) {
    $method === 'GET' && $page !== '' => $ctrl->show($page),
    $method === 'PUT' && $page !== '' => $ctrl->update($page, $body),
    default => methodNotAllowed(),
};
