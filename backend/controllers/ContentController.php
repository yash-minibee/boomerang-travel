<?php

declare(strict_types=1);

class ContentController
{
    public function show(string $page): void
    {
        $allowed = ['home', 'about', 'contact'];
        if (!in_array($page, $allowed, true)) {
            Response::notFound('Page not found.');
        }
        Response::success((new ContentModel())->byPage($page));
    }

    public function update(string $page, array $body): void
    {
        AuthMiddleware::handle();
        $allowed = ['home', 'about', 'contact'];
        if (!in_array($page, $allowed, true)) {
            Response::notFound('Page not found.');
        }
        if (empty($body)) {
            Response::error('No content provided.', 400);
        }
        $model = new ContentModel();
        $model->bulkUpdate($page, $body);
        Response::success($model->byPage($page), 'Content updated.');
    }
}
