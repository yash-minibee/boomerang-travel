<?php

declare(strict_types=1);

class AdminUserModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM admin_users WHERE email = ? LIMIT 1');
        $stmt->execute([$email]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT id, name, email, role, avatar_url, created_at, last_login FROM admin_users WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function updateLastLogin(int $id): void
    {
        $stmt = $this->db->prepare('UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?');
        $stmt->execute([$id]);
    }

    public function all(): array
    {
        $stmt = $this->db->prepare('SELECT id, name, email, role, avatar_url, created_at, last_login FROM admin_users ORDER BY created_at DESC');
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function update(int $id, array $data): void
    {
        $fields = [];
        $params = [];
        foreach ($data as $key => $val) {
            $fields[] = "$key = ?";
            $params[] = $val;
        }
        $params[] = $id;
        $sql = 'UPDATE admin_users SET ' . implode(', ', $fields) . ' WHERE id = ?';
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
    }
}

