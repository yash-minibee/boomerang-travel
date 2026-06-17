<?php
// GET    /api/packages.php              → list
// POST   /api/packages.php              → create
// GET    /api/packages.php?id=5         → show by ID
// GET    /api/packages.php?slug=my-pkg  → show by slug
// PUT    /api/packages.php?id=5         → update
// DELETE /api/packages.php?id=5         → delete
// PATCH  /api/packages.php?id=5&action=featured → toggle featured

declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

$id     = isset($_GET['id'])   ? (int) $_GET['id']   : null;
$slug   = $_GET['slug']   ?? null;
$action = $_GET['action'] ?? null;
$ctrl   = new PackageController();

match (true) {
    $method === 'GET'    && $id === null && $slug === null => $ctrl->index(),
    $method === 'POST'   && $id === null                   => $ctrl->store($body),
    $method === 'GET'    && $id !== null                   => $ctrl->showById($id),
    $method === 'GET'    && $slug !== null                  => $ctrl->show($slug),
    $method === 'PUT'    && $id !== null                   => $ctrl->update($id, $body),
    $method === 'DELETE' && $id !== null                   => $ctrl->destroy($id),
    $method === 'PATCH'  && $id !== null && $action === 'featured' => $ctrl->toggleFeatured($id),
    default => methodNotAllowed(),
};
