<?php

declare(strict_types=1);

class CustomerModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function count(array $filters = []): int
    {
        [$where, $params] = $this->buildWhere($filters);
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM customers WHERE 1=1 {$where}");
        $stmt->execute($params);
        return (int) $stmt->fetchColumn();
    }

    public function all(array $filters = [], int $limit = 10, int $offset = 0): array
    {
        [$where, $params] = $this->buildWhere($filters);
        $params[] = $limit;
        $params[] = $offset;
        $stmt = $this->db->prepare(
            "SELECT * FROM customers WHERE 1=1 {$where} ORDER BY created_at DESC LIMIT ? OFFSET ?"
        );
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM customers WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM customers WHERE email = ? LIMIT 1');
        $stmt->execute([$email]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function upsert(array $data): int
    {
        $existing = $this->findByEmail($data['email']);
        if ($existing) {
            $stmt = $this->db->prepare(
                'UPDATE customers SET last_activity = CURRENT_TIMESTAMP WHERE id = ?'
            );
            $stmt->execute([$existing['id']]);
            return (int) $existing['id'];
        }
        $stmt = $this->db->prepare(
            'INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)'
        );
        $stmt->execute([
            $data['name']  ?? '',
            $data['email'] ?? '',
            $data['phone'] ?? null,
        ]);
        return (int) $this->db->lastInsertId();
    }

    private function buildWhere(array $filters): array
    {
        $where  = '';
        $params = [];
        if (!empty($filters['search'])) {
            $where   .= ' AND (name LIKE ? OR email LIKE ?)';
            $s        = '%' . $filters['search'] . '%';
            $params[] = $s;
            $params[] = $s;
        }
        return [$where, $params];
    }
}
