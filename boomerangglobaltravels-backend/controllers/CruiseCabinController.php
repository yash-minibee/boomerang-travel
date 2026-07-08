<?php

declare(strict_types=1);

class CruiseCabinController
{
    public function index(int $cruiseId): void
    {
        $cruise = (new CruiseModel())->findById($cruiseId);
        if (!$cruise) {
            Response::notFound('Cruise not found.');
        }
        Response::success((new CruiseCabinModel())->byCruise($cruiseId));
    }

    public function bulkStore(int $cruiseId, array $body): void
    {
        AuthMiddleware::handle();
        $cruise = (new CruiseModel())->findById($cruiseId);
        if (!$cruise) {
            Response::notFound('Cruise not found.');
        }
        $cabins = $body['cabins'] ?? [];
        if (!is_array($cabins)) {
            Response::error('cabins must be an array.', 422);
        }
        $model = new CruiseCabinModel();
        $model->bulkReplace($cruiseId, $cabins);
        Response::success($model->byCruise($cruiseId), 'Cabins saved.');
    }

    public function destroy(int $cabinId): void
    {
        AuthMiddleware::handle();
        if (!(new CruiseCabinModel())->delete($cabinId)) {
            Response::notFound('Cabin not found.');
        }
        Response::success(null, 'Cabin deleted.');
    }
}
