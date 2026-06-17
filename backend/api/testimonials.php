<?php
// GET    /api/testimonials.php                        → approved only (public)
// GET    /api/testimonials.php?scope=all              → all (admin)
// POST   /api/testimonials.php                        → submit (public)
// PATCH  /api/testimonials.php?id=5&action=status     → update status (admin)
// DELETE /api/testimonials.php?id=5                   → delete (admin)

declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

$id     = isset($_GET['id']) ? (int) $_GET['id'] : null;
$scope  = $_GET['scope']  ?? null;
$action = $_GET['action'] ?? null;
$ctrl   = new TestimonialController();

match (true) {
    $method === 'GET'    && $id === null && $scope === 'all'      => $ctrl->indexAll(),
    $method === 'GET'    && $id === null                          => $ctrl->index(),
    $method === 'POST'   && $id === null                          => $ctrl->store($body),
    $method === 'PATCH'  && $id !== null && $action === 'status'  => $ctrl->updateStatus($id, $body),
    $method === 'DELETE' && $id !== null                          => $ctrl->destroy($id),
    default => methodNotAllowed(),
};
