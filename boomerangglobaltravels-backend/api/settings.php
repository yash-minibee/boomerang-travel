<?php
// GET  /api/settings.php   → get all settings (admin)
// PUT  /api/settings.php   → update settings (admin)

declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

$ctrl = new SettingsController();

match ($method) {
    'GET' => $ctrl->index(),
    'PUT' => $ctrl->update($body),
    default => methodNotAllowed(),
};
