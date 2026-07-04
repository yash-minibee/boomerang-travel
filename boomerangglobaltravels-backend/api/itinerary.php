<?php
// GET    /api/itinerary.php?package_id=5   → list days for package
// POST   /api/itinerary.php?package_id=5   → bulk save days for package
// DELETE /api/itinerary.php?id=3           → delete a single day

declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

$packageId = isset($_GET['package_id']) ? (int) $_GET['package_id'] : null;
$id        = isset($_GET['id'])         ? (int) $_GET['id']         : null;
$ctrl      = new ItineraryController();

match (true) {
    $method === 'GET'    && $packageId !== null => $ctrl->index($packageId),
    $method === 'POST'   && $packageId !== null => $ctrl->bulkStore($packageId, $body),
    $method === 'DELETE' && $id !== null        => $ctrl->destroy($id),
    default => methodNotAllowed(),
};
