<?php

declare(strict_types=1);

class SettingsController
{
    public function index(): void
    {
        AuthMiddleware::handle();
        Response::success((new SettingsModel())->all());
    }

    public function update(array $body): void
    {
        AuthMiddleware::handle();
        if (empty($body)) {
            Response::error('No settings provided.', 400);
        }
        $model = new SettingsModel();
        $model->bulkUpdate($body);
        Response::success($model->all(), 'Settings updated.');
    }
}
