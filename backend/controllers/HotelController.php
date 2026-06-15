<?php

declare(strict_types=1);

class HotelController
{
    public function index(int $packageId): void
    {
        $pkg = (new PackageModel())->findById($packageId);
        if (!$pkg) {
            Response::notFound('Package not found.');
        }
        Response::success((new HotelModel())->byPackage($packageId));
    }

    public function bulkStore(int $packageId, array $body): void
    {
        AuthMiddleware::handle();
        $pkg = (new PackageModel())->findById($packageId);
        if (!$pkg) {
            Response::notFound('Package not found.');
        }
        $hotels = $body['hotels'] ?? [];
        if (!is_array($hotels)) {
            Response::error('hotels must be an array.', 422);
        }
        $model = new HotelModel();
        $model->bulkReplace($packageId, $hotels);
        Response::success($model->byPackage($packageId), 'Hotels saved.');
    }

    public function destroy(int $hotelId): void
    {
        AuthMiddleware::handle();
        if (!(new HotelModel())->delete($hotelId)) {
            Response::notFound('Hotel not found.');
        }
        Response::success(null, 'Hotel deleted.');
    }
}
