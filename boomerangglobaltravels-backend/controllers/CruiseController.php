<?php

declare(strict_types=1);

class CruiseController
{
    public function index(): void
    {
        $model   = new CruiseModel();
        $filters = [
            'search'      => $_GET['search']      ?? '',
            'destination' => $_GET['destination']  ?? '',
            'status'      => $_GET['status']       ?? '',
            'category'    => $_GET['category']     ?? '',
            'featured'    => $_GET['featured']     ?? '',
        ];
        $sort  = $_GET['sort']  ?? 'created_at';
        $order = $_GET['order'] ?? 'desc';
        $req   = Paginator::fromRequest();
        $total = $model->count($filters);
        $pg    = Paginator::paginate($total, $req['page'], $req['limit']);

        $cruises = $model->all($filters, $pg['limit'], $pg['offset'], $sort, $order);
        Response::success($cruises, 'OK', 200, $pg['meta']);
    }

    public function showById(int $id): void
    {
        $model  = new CruiseModel();
        $cruise = $model->findById($id);
        if (!$cruise) {
            Response::notFound('Cruise not found.');
        }
        $itinerary = (new CruiseItineraryModel())->byCruise($id);
        $cabins    = (new CruiseCabinModel())->byCruise($id);
        $cruise['itinerary'] = $itinerary;
        $cruise['cabins']    = $cabins;
        Response::success($cruise);
    }

    public function show(string $slug): void
    {
        $model  = new CruiseModel();
        $cruise = $model->findBySlug($slug);
        if (!$cruise) {
            Response::notFound('Cruise not found.');
        }
        $itinerary = (new CruiseItineraryModel())->byCruise((int) $cruise['id']);
        $cabins    = (new CruiseCabinModel())->byCruise((int) $cruise['id']);
        $cruise['itinerary'] = $itinerary;
        $cruise['cabins']    = $cabins;
        Response::success($cruise);
    }

    public function store(array $body): void
    {
        $payload = AuthMiddleware::handle();

        $errors = ValidationMiddleware::validate($body, [
            'title'         => 'required|min:3',
            'starting_price' => 'required|numeric',
        ]);
        if (!empty($errors)) {
            Response::error('Validation failed.', 422, $errors);
        }

        $slug           = SlugHelper::unique($body['slug'] ?? $body['title'], 'cruises');
        $body['slug']   = $slug;
        $body['created_by'] = $payload['id'];
        $body['updated_by'] = $payload['id'];

        $model = new CruiseModel();
        $id    = $model->create($body);
        $cruise = $model->findById($id);
        Response::success($cruise, 'Cruise created.', 201);
    }

    public function update(int $id, array $body): void
    {
        $payload = AuthMiddleware::handle();
        $model   = new CruiseModel();

        if (!$model->findById($id)) {
            Response::notFound('Cruise not found.');
        }

        if (!empty($body['title']) && empty($body['slug'])) {
            $body['slug'] = SlugHelper::unique($body['title'], 'cruises', $id);
        }
        $body['updated_by'] = $payload['id'];

        $model->update($id, $body);
        Response::success($model->findById($id), 'Cruise updated.');
    }

    public function destroy(int $id): void
    {
        AuthMiddleware::handle();
        $model = new CruiseModel();
        if (!$model->findById($id)) {
            Response::notFound('Cruise not found.');
        }
        $model->softDelete($id);
        Response::success(null, 'Cruise deleted.');
    }

    public function toggleFeatured(int $id): void
    {
        AuthMiddleware::handle();
        $model  = new CruiseModel();
        $result = $model->toggleFeatured($id);
        if ($result === null) {
            Response::notFound('Cruise not found.');
        }
        Response::success($result, 'Featured status toggled.');
    }
}
