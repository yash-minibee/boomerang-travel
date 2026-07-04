<?php

declare(strict_types=1);

class ItineraryController
{
    public function index(int $packageId): void
    {
        $pkg = (new PackageModel())->findById($packageId);
        if (!$pkg) {
            Response::notFound('Package not found.');
        }
        $days = (new ItineraryModel())->byPackage($packageId);
        Response::success($days);
    }

    public function bulkStore(int $packageId, array $body): void
    {
        AuthMiddleware::handle();
        $pkg = (new PackageModel())->findById($packageId);
        if (!$pkg) {
            Response::notFound('Package not found.');
        }
        $days = $body['days'] ?? [];
        if (!is_array($days)) {
            Response::error('days must be an array.', 422);
        }
        $model = new ItineraryModel();
        $model->bulkReplace($packageId, $days);
        Response::success($model->byPackage($packageId), 'Itinerary saved.');
    }

    public function destroy(int $dayId): void
    {
        AuthMiddleware::handle();
        $deleted = (new ItineraryModel())->delete($dayId);
        if (!$deleted) {
            Response::notFound('Itinerary day not found.');
        }
        Response::success(null, 'Day deleted.');
    }
}
