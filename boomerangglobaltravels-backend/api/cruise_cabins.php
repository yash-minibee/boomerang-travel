<?php
// GET    /api/cruise_cabins.php?cruise_id=5   → list cabins for cruise
// POST   /api/cruise_cabins.php?cruise_id=5   → bulk save cabins for cruise
// DELETE /api/cruise_cabins.php?id=3           → delete a single cabin

declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

$cruiseId = isset($_GET['cruise_id']) ? (int) $_GET['cruise_id'] : null;
$id       = isset($_GET['id'])        ? (int) $_GET['id']        : null;
$ctrl     = new CruiseCabinController();

match (true) {
    $method === 'GET'    && $cruiseId !== null => $ctrl->index($cruiseId),
    $method === 'POST'   && $cruiseId !== null => $ctrl->bulkStore($cruiseId, $body),
    $method === 'DELETE' && $id !== null       => $ctrl->destroy($id),
    default => methodNotAllowed(),
};
