<?php

declare(strict_types=1);

class InquiryModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function count(array $filters = []): int
    {
        [$where, $params] = $this->buildWhere($filters);
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM inquiries WHERE 1=1 {$where}");
        $stmt->execute($params);
        return (int) $stmt->fetchColumn();
    }

    public function all(array $filters = [], int $limit = 10, int $offset = 0): array
    {
        [$where, $params] = $this->buildWhere($filters);
        $params[] = $limit;
        $params[] = $offset;

        $stmt = $this->db->prepare(
            "SELECT * FROM inquiries WHERE 1=1 {$where} ORDER BY created_at DESC LIMIT ? OFFSET ?"
        );
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM inquiries WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO inquiries (customer_name, customer_email, customer_phone, customer_country, package_id, package_name,
             travel_date, travellers, budget_range, message, status, type)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $data['customer_name'],
            $data['customer_email'],
            $data['customer_phone']   ?? null,
            $data['customer_country'] ?? null,
            $data['package_id']       ?? null,
            $data['package_name']     ?? null,
            $data['travel_date']      ?? null,
            $data['travellers']       ?? null,
            $data['budget_range']     ?? null,
            $data['message']          ?? null,
            'New',
            $data['type']             ?? 'package',
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function updateStatus(int $id, string $status): bool
    {
        $stmt = $this->db->prepare('UPDATE inquiries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
        $stmt->execute([$status, $id]);
        return $stmt->rowCount() > 0;
    }

    private function buildWhere(array $filters): array
    {
        $where  = '';
        $params = [];

        if (!empty($filters['status'])) {
            $where   .= ' AND status = ?';
            $params[] = $filters['status'];
        }
        if (!empty($filters['type'])) {
            $where   .= ' AND type = ?';
            $params[] = $filters['type'];
        }
        if (!empty($filters['search'])) {
            $where   .= ' AND (customer_name LIKE ? OR customer_email LIKE ? OR package_name LIKE ?)';
            $s = '%' . $filters['search'] . '%';
            $params[] = $s;
            $params[] = $s;
            $params[] = $s;
        }

        return [$where, $params];
    }
}
