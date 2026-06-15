<?php

declare(strict_types=1);

class CustomerController
{
    public function index(): void
    {
        AuthMiddleware::handle();
        $model   = new CustomerModel();
        $filters = ['search' => $_GET['search'] ?? ''];
        $req     = Paginator::fromRequest();
        $total   = $model->count($filters);
        $pg      = Paginator::paginate($total, $req['page'], $req['limit']);
        Response::success($model->all($filters, $pg['limit'], $pg['offset']), 'OK', 200, $pg['meta']);
    }

    public function show(int $id): void
    {
        AuthMiddleware::handle();
        $customer = (new CustomerModel())->findById($id);
        if (!$customer) {
            Response::notFound('Customer not found.');
        }
        Response::success($customer);
    }
}
