<?php
// GET    /api/cruise_destinations.php          → list
// POST   /api/cruise_destinations.php          → create
// GET    /api/cruise_destinations.php?id=5     → show
// PUT    /api/cruise_destinations.php?id=5     → update
// DELETE /api/cruise_destinations.php?id=5     → delete

declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

$id   = isset($_GET['id']) ? (int) $_GET['id'] : null;
$ctrl = new CruiseDestinationController();

match (true) {
    $method === 'GET'    && $id === null => $ctrl->index(),
    $method === 'POST'   && $id === null => $ctrl->store($body),
    $method === 'GET'    && $id !== null => $ctrl->show($id),
    $method === 'PUT'    && $id !== null => $ctrl->update($id, $body),
    $method === 'DELETE' && $id !== null => $ctrl->destroy($id),
    default => methodNotAllowed(),
};
