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

    public function updateProfile(array $body): void
    {
        $payload = AuthMiddleware::handle();
        $id      = (int) $payload['id'];

        $errors = ValidationMiddleware::validate($body, [
            'name'  => 'required',
            'email' => 'required|email',
        ]);

        if (isset($body['password']) && $body['password'] !== '') {
            if (strlen($body['password']) < 6) {
                $errors['password'] = 'Password must be at least 6 characters.';
            }
        }

        if (!empty($errors)) {
            Response::error('Validation failed.', 422, $errors);
        }

        $model = new AdminUserModel();
        $user  = $model->findById($id);
        if (!$user) {
            Response::notFound('User not found.');
        }

        $email = Sanitizer::email($body['email']);
        $existing = $model->findByEmail($email);
        if ($existing && (int) $existing['id'] !== $id) {
            Response::error('Email is already in use.', 422, ['email' => 'Email is already in use.']);
        }

        $updateData = [
            'name'  => Sanitizer::string($body['name']),
            'email' => $email,
        ];

        if (isset($body['password']) && $body['password'] !== '') {
            $updateData['password_hash'] = password_hash($body['password'], PASSWORD_BCRYPT);
        }

        if (array_key_exists('avatar_url', $body)) {
            $updateData['avatar_url'] = $body['avatar_url'] ? Sanitizer::string($body['avatar_url']) : null;
        }

        $model->update($id, $updateData);

        $updatedUser = $model->findById($id);
        Response::success($updatedUser, 'Profile updated successfully.');
    }
}

