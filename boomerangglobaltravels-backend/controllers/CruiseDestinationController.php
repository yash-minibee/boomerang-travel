<?php

declare(strict_types=1);

class CruiseDestinationController
{
    public function index(): void
    {
        $model   = new CruiseDestinationModel();
        $model->refreshCruiseCounts();
        $filters = [
            'search'   => $_GET['search']   ?? '',
            'region'   => $_GET['region']   ?? '',
            'featured' => $_GET['featured'] ?? '',
        ];
        $req   = Paginator::fromRequest();
        $total = $model->count($filters);
        $pg    = Paginator::paginate($total, $req['page'], $req['limit']);
        Response::success($model->all($filters, $pg['limit'], $pg['offset']), 'OK', 200, $pg['meta']);
    }

    public function show(int $id): void
    {
        $dest = (new CruiseDestinationModel())->findById($id);
        if (!$dest) {
            Response::notFound('Cruise Destination not found.');
        }
        Response::success($dest);
    }

    public function store(array $body): void
    {
        $payload = AuthMiddleware::handle();
        $errors  = ValidationMiddleware::validate($body, ['name' => 'required|min:2']);
        if (!empty($errors)) {
            Response::error('Validation failed.', 422, $errors);
        }
        $body['created_by'] = $payload['id'];
        $body['updated_by'] = $payload['id'];
        $model = new CruiseDestinationModel();
        $id    = $model->create($body);
        Response::success($model->findById($id), 'Cruise Destination created.', 201);
    }

    public function update(int $id, array $body): void
    {
        $payload = AuthMiddleware::handle();
        $model   = new CruiseDestinationModel();
        if (!$model->findById($id)) {
            Response::notFound('Cruise Destination not found.');
        }
        $body['updated_by'] = $payload['id'];
        $model->update($id, $body);
        Response::success($model->findById($id), 'Cruise Destination updated.');
    }

    public function destroy(int $id): void
    {
        AuthMiddleware::handle();
        $model = new CruiseDestinationModel();
        if (!$model->findById($id)) {
            Response::notFound('Cruise Destination not found.');
        }
        $model->softDelete($id);
        Response::success(null, 'Cruise Destination deleted.');
    }
}
