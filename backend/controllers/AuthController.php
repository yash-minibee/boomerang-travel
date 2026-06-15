<?php

declare(strict_types=1);

class AuthController
{
    public function login(array $body): void
    {
        RateLimitMiddleware::handle();

        $errors = ValidationMiddleware::validate($body, [
            'email'    => 'required|email',
            'password' => 'required|min:6',
        ]);
        if (!empty($errors)) {
            Response::error('Validation failed.', 422, $errors);
        }

        $model = new AdminUserModel();
        $user  = $model->findByEmail(Sanitizer::email($body['email']));

        if (!$user || !password_verify($body['password'], $user['password_hash'])) {
            Response::error('Invalid email or password.', 401);
        }

        $model->updateLastLogin((int) $user['id']);

        $expiry  = (int) Env::get('JWT_EXPIRY', 86400);
        $payload = [
            'id'    => $user['id'],
            'email' => $user['email'],
            'role'  => $user['role'],
            'exp'   => time() + $expiry,
        ];

        $token = JWT::encode($payload);

        unset($user['password_hash']);
        Response::success(['token' => $token, 'user' => $user], 'Login successful.');
    }

    public function logout(): void
    {
        AuthMiddleware::handle();
        Response::success(null, 'Logged out successfully.');
    }

    public function me(): void
    {
        $payload = AuthMiddleware::handle();
        $model   = new AdminUserModel();
        $user    = $model->findById((int) $payload['id']);
        if (!$user) {
            Response::notFound('User not found.');
        }
        Response::success($user);
    }
}
