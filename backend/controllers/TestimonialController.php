<?php

declare(strict_types=1);

class TestimonialController
{
    public function index(): void
    {
        Response::success((new TestimonialModel())->allPublic());
    }

    public function indexAll(): void
    {
        AuthMiddleware::handle();
        Response::success((new TestimonialModel())->all());
    }

    public function store(array $body): void
    {
        $errors = ValidationMiddleware::validate($body, [
            'customer_name' => 'required|min:2',
            'review_text'   => 'required|min:10',
            'rating'        => 'required|numeric',
        ]);
        if (!empty($errors)) {
            Response::error('Validation failed.', 422, $errors);
        }
        $model = new TestimonialModel();
        $id    = $model->create($body);
        Response::success($model->findById($id), 'Testimonial submitted.', 201);
    }

    public function updateStatus(int $id, array $body): void
    {
        AuthMiddleware::handle();
        $allowed = ['Pending', 'Approved', 'Rejected'];
        $status  = $body['status'] ?? '';
        if (!in_array($status, $allowed, true)) {
            Response::error('Invalid status.', 422, ['status' => 'Must be Pending, Approved, or Rejected.']);
        }
        $model = new TestimonialModel();
        if (!$model->findById($id)) {
            Response::notFound('Testimonial not found.');
        }
        $model->updateStatus($id, $status);
        Response::success($model->findById($id), 'Status updated.');
    }

    public function destroy(int $id): void
    {
        AuthMiddleware::handle();
        if (!(new TestimonialModel())->delete($id)) {
            Response::notFound('Testimonial not found.');
        }
        Response::success(null, 'Testimonial deleted.');
    }
}
