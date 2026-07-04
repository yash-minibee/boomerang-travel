<?php
// GET    /api/media.php          → list (admin)
// POST   /api/media.php          → upload file (admin)
// DELETE /api/media.php?id=5     → delete (admin)

declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

$id   = isset($_GET['id']) ? (int) $_GET['id'] : null;
$ctrl = new MediaController();

match (true) {
    $method === 'GET'    && $id === null => $ctrl->index(),
    $method === 'POST'   && $id === null => $ctrl->upload(),
    $method === 'DELETE' && $id !== null => $ctrl->destroy($id),
    default => methodNotAllowed(),
};
