<?php
// POST   /api/inquiries.php             → submit inquiry (public)
// GET    /api/inquiries.php             → list (admin)
// GET    /api/inquiries.php?id=5        → show (admin)
// PATCH  /api/inquiries.php?id=5&action=status → update status (admin)

declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

$id     = isset($_GET['id']) ? (int) $_GET['id'] : null;
$action = $_GET['action'] ?? null;
$ctrl   = new InquiryController();

match (true) {
    $method === 'POST'  && $id === null                          => $ctrl->store($body),
    $method === 'GET'   && $id === null                          => $ctrl->index(),
    $method === 'GET'   && $id !== null                          => $ctrl->show($id),
    $method === 'PATCH' && $id !== null && $action === 'status'  => $ctrl->updateStatus($id, $body),
    default => methodNotAllowed(),
};
