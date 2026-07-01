<?php

declare(strict_types=1);

class SettingsController
{
    public function index(): void
    {
        $headers = getallheaders();
        $auth    = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        $isAdmin = false;
        if (!empty($auth) && str_starts_with($auth, 'Bearer ')) {
            $token = substr($auth, 7);
            try {
                JWT::decode($token);
                $isAdmin = true;
            } catch (RuntimeException $e) {
                // Ignore token decode exception, treat as public access
            }
        }

        $settings = (new SettingsModel())->all();

        if (!$isAdmin) {
            $sensitiveKeys = ['smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass'];
            foreach ($sensitiveKeys as $key) {
                unset($settings[$key]);
            }
        }

        Response::success($settings);
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
