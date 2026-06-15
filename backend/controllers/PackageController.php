<?php

declare(strict_types=1);

class PackageController
{
    public function index(): void
    {
        $model   = new PackageModel();
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

        $packages = $model->all($filters, $pg['limit'], $pg['offset'], $sort, $order);
        Response::success($packages, 'OK', 200, $pg['meta']);
    }

    public function showById(int $id): void
    {
        $model   = new PackageModel();
        $package = $model->findById($id);
        if (!$package) {
            Response::notFound('Package not found.');
        }
        $itinerary = (new ItineraryModel())->byPackage($id);
        $hotels    = (new HotelModel())->byPackage($id);
        $package['itinerary'] = $itinerary;
        $package['hotels']    = $hotels;
        Response::success($package);
    }

    public function show(string $slug): void
    {
        $model   = new PackageModel();
        $package = $model->findBySlug($slug);
        if (!$package) {
            Response::notFound('Package not found.');
        }
        $itinerary = (new ItineraryModel())->byPackage((int) $package['id']);
        $hotels    = (new HotelModel())->byPackage((int) $package['id']);
        $package['itinerary'] = $itinerary;
        $package['hotels']    = $hotels;
        Response::success($package);
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

        $slug           = SlugHelper::unique($body['slug'] ?? $body['title'], 'packages');
        $body['slug']   = $slug;
        $body['created_by'] = $payload['id'];
        $body['updated_by'] = $payload['id'];

        $model = new PackageModel();
        $id    = $model->create($body);
        $pkg   = $model->findById($id);
        Response::success($pkg, 'Package created.', 201);
    }

    public function update(int $id, array $body): void
    {
        $payload = AuthMiddleware::handle();
        $model   = new PackageModel();

        if (!$model->findById($id)) {
            Response::notFound('Package not found.');
        }

        if (!empty($body['title']) && empty($body['slug'])) {
            $body['slug'] = SlugHelper::unique($body['title'], 'packages', $id);
        }
        $body['updated_by'] = $payload['id'];

        $model->update($id, $body);
        Response::success($model->findById($id), 'Package updated.');
    }

    public function destroy(int $id): void
    {
        AuthMiddleware::handle();
        $model = new PackageModel();
        if (!$model->findById($id)) {
            Response::notFound('Package not found.');
        }
        $model->softDelete($id);
        Response::success(null, 'Package deleted.');
    }

    public function toggleFeatured(int $id): void
    {
        AuthMiddleware::handle();
        $model  = new PackageModel();
        $result = $model->toggleFeatured($id);
        if (!$result) {
            Response::notFound('Package not found.');
        }
        Response::success($result, 'Featured status toggled.');
    }
}
