<?php

declare(strict_types=1);

class InquiryController
{
    public function store(array $body): void
    {
        $type = $body['type'] ?? 'package';
        $rules = [
            'customer_name'  => 'required|min:2',
            'customer_email' => 'required|email',
        ];

        if ($type === 'custom') {
            $rules['customer_country'] = 'required';
            $rules['customer_phone']   = 'required';
            $rules['package_name']     = 'required';
            $rules['travel_date']      = 'required';
            $rules['travellers']       = 'required';
        }

        $errors = ValidationMiddleware::validate($body, $rules);
        if (!empty($errors)) {
            Response::error('Validation failed.', 422, $errors);
        }

        $model = new InquiryModel();
        $id    = $model->create($body);

        // auto-upsert customer
        (new CustomerModel())->upsert([
            'name'  => $body['customer_name'],
            'email' => $body['customer_email'],
            'phone' => $body['customer_phone'] ?? null,
        ]);

        $inquiry = $model->findById($id);
        Response::success($inquiry, 'Inquiry submitted.', 201);
    }

    public function index(): void
    {
        AuthMiddleware::handle();
        $model   = new InquiryModel();
        $filters = [
            'status' => $_GET['status'] ?? '',
            'type'   => $_GET['type']   ?? '',
            'search' => $_GET['search'] ?? '',
        ];
        $req   = Paginator::fromRequest();
        $total = $model->count($filters);
        $pg    = Paginator::paginate($total, $req['page'], $req['limit']);
        Response::success($model->all($filters, $pg['limit'], $pg['offset']), 'OK', 200, $pg['meta']);
    }

    public function show(int $id): void
    {
        AuthMiddleware::handle();
        $inq = (new InquiryModel())->findById($id);
        if (!$inq) {
            Response::notFound('Inquiry not found.');
        }
        Response::success($inq);
    }

    public function updateStatus(int $id, array $body): void
    {
        AuthMiddleware::handle();
        $allowed = ['New', 'Contacted', 'Proposal Sent', 'Confirmed', 'Closed'];
        $status  = $body['status'] ?? '';
        if (!in_array($status, $allowed, true)) {
            Response::error('Invalid status value.', 422, ['status' => 'Must be one of: ' . implode(', ', $allowed)]);
        }
        $model = new InquiryModel();
        if (!$model->findById($id)) {
            Response::notFound('Inquiry not found.');
        }
        $model->updateStatus($id, $status);
        Response::success($model->findById($id), 'Status updated.');
    }
}
