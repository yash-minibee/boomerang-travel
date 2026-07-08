<?php

declare(strict_types=1);

class GlobalCabinController
{
    public function index(): void
    {
        $model   = new GlobalCabinModel();
        $filters = [
            'search' => $_GET['search'] ?? '',
            'type'   => $_GET['type']   ?? '',
        ];
        $req   = Paginator::fromRequest();
        $total = $model->count($filters);
        $pg    = Paginator::paginate($total, $req['page'], $req['limit']);
        Response::success($model->all($filters, $pg['limit'], $pg['offset']), 'OK', 200, $pg['meta']);
    }

    public function show(int $id): void
    {
        $cabin = (new GlobalCabinModel())->findById($id);
        if (!$cabin) {
            Response::notFound('Cabin not found.');
        }
        Response::success($cabin);
    }

    public function store(array $body): void
    {
        AuthMiddleware::handle();
        $errors = ValidationMiddleware::validate($body, [
            'name' => 'required|min:2'
        ]);
        if (!empty($errors)) {
            Response::error('Validation failed.', 422, $errors);
        }

        $model = new GlobalCabinModel();
        $id    = $model->create($body);
        Response::success($model->findById($id), 'Cabin created.', 201);
    }

    public function update(int $id, array $body): void
    {
        AuthMiddleware::handle();
        $model = new GlobalCabinModel();
        if (!$model->findById($id)) {
            Response::notFound('Cabin not found.');
        }

        $errors = ValidationMiddleware::validate($body, [
            'name' => 'required|min:2'
        ]);
        if (!empty($errors)) {
            Response::error('Validation failed.', 422, $errors);
        }

        $model->update($id, $body);
        Response::success($model->findById($id), 'Cabin updated.');
    }

    public function destroy(int $id): void
    {
        AuthMiddleware::handle();
        $model = new GlobalCabinModel();
        if (!$model->findById($id)) {
            Response::notFound('Cabin not found.');
        }
        $model->delete($id);
        Response::success(null, 'Cabin deleted.');
    }
}
