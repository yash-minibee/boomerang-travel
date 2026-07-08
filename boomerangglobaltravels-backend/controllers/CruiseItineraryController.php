<?php

declare(strict_types=1);

class CruiseItineraryController
{
    public function index(int $cruiseId): void
    {
        $cruise = (new CruiseModel())->findById($cruiseId);
        if (!$cruise) {
            Response::notFound('Cruise not found.');
        }
        $days = (new CruiseItineraryModel())->byCruise($cruiseId);
        Response::success($days);
    }

    public function bulkStore(int $cruiseId, array $body): void
    {
        AuthMiddleware::handle();
        $cruise = (new CruiseModel())->findById($cruiseId);
        if (!$cruise) {
            Response::notFound('Cruise not found.');
        }
        $days = $body['days'] ?? [];
        if (!is_array($days)) {
            Response::error('days must be an array.', 422);
        }
        $model = new CruiseItineraryModel();
        $model->bulkReplace($cruiseId, $days);
        Response::success($model->byCruise($cruiseId), 'Itinerary saved.');
    }

    public function destroy(int $dayId): void
    {
        AuthMiddleware::handle();
        $deleted = (new CruiseItineraryModel())->delete($dayId);
        if (!$deleted) {
            Response::notFound('Itinerary day not found.');
        }
        Response::success(null, 'Day deleted.');
    }
}
