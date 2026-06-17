<?php
// GET    /api/hotels.php?package_id=5   → list hotels for package
// POST   /api/hotels.php?package_id=5   → bulk save hotels for package
// DELETE /api/hotels.php?id=3           → delete a single hotel

declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

$packageId = isset($_GET['package_id']) ? (int) $_GET['package_id'] : null;
$id        = isset($_GET['id'])         ? (int) $_GET['id']         : null;
$ctrl      = new HotelController();

match (true) {
    $method === 'GET'    && $packageId !== null => $ctrl->index($packageId),
    $method === 'POST'   && $packageId !== null => $ctrl->bulkStore($packageId, $body),
    $method === 'DELETE' && $id !== null        => $ctrl->destroy($id),
    default => methodNotAllowed(),
};
