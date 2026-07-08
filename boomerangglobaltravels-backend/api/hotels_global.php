<?php
// GET    /api/hotels_global.php          → list
// POST   /api/hotels_global.php          → create
// GET    /api/hotels_global.php?id=5     → show
// PUT    /api/hotels_global.php?id=5     → update
// DELETE /api/hotels_global.php?id=5     → delete

declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

$id   = isset($_GET['id']) ? (int) $_GET['id'] : null;
$ctrl = new GlobalHotelController();

match (true) {
    $method === 'GET'    && $id === null => $ctrl->index(),
    $method === 'POST'   && $id === null => $ctrl->store($body),
    $method === 'GET'    && $id !== null => $ctrl->show($id),
    $method === 'PUT'    && $id !== null => $ctrl->update($id, $body),
    $method === 'DELETE' && $id !== null => $ctrl->destroy($id),
    default => methodNotAllowed(),
};
