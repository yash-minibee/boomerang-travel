<?php

declare(strict_types=1);

class GlobalHotelController
{
    public function index(): void
    {
        $model   = new GlobalHotelModel();
        $filters = [
            'search' => $_GET['search'] ?? '',
            'city'   => $_GET['city']   ?? '',
        ];
        $req   = Paginator::fromRequest();
        $total = $model->count($filters);
        $pg    = Paginator::paginate($total, $req['page'], $req['limit']);
        Response::success($model->all($filters, $pg['limit'], $pg['offset']), 'OK', 200, $pg['meta']);
    }

    public function show(int $id): void
    {
        $hotel = (new GlobalHotelModel())->findById($id);
        if (!$hotel) {
            Response::notFound('Hotel not found.');
        }
        Response::success($hotel);
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

        $model = new GlobalHotelModel();
        $id    = $model->create($body);
        Response::success($model->findById($id), 'Hotel created.', 201);
    }

    public function update(int $id, array $body): void
    {
        AuthMiddleware::handle();
        $model = new GlobalHotelModel();
        if (!$model->findById($id)) {
            Response::notFound('Hotel not found.');
        }

        $errors = ValidationMiddleware::validate($body, [
            'name' => 'required|min:2'
        ]);
        if (!empty($errors)) {
            Response::error('Validation failed.', 422, $errors);
        }

        $model->update($id, $body);
        Response::success($model->findById($id), 'Hotel updated.');
    }

    public function destroy(int $id): void
    {
        AuthMiddleware::handle();
        $model = new GlobalHotelModel();
        if (!$model->findById($id)) {
            Response::notFound('Hotel not found.');
        }
        $model->delete($id);
        Response::success(null, 'Hotel deleted.');
    }
}
