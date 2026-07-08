<?php

declare(strict_types=1);

class GlobalHotelModel
{
    private PDO $db;
    private array $jsonFields = ['amenities'];

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function count(array $filters = []): int
    {
        [$where, $params] = $this->buildWhere($filters);
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM hotels WHERE 1=1 {$where}");
        $stmt->execute($params);
        return (int) $stmt->fetchColumn();
    }

    public function all(array $filters = [], int $limit = 10, int $offset = 0): array
    {
        [$where, $params] = $this->buildWhere($filters);
        $params[] = $limit;
        $params[] = $offset;

        $stmt = $this->db->prepare(
            "SELECT * FROM hotels WHERE 1=1 {$where} ORDER BY name ASC LIMIT ? OFFSET ?"
        );
        $stmt->execute($params);
        return array_map(fn($r) => $this->decode($r), $stmt->fetchAll());
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM hotels WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? $this->decode($row) : null;
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO hotels (name, city, star_rating, image_url, amenities)
             VALUES (?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $data['name'],
            $data['city']        ?? null,
            $data['star_rating'] ?? 5,
            $data['image_url']   ?? null,
            json_encode($data['amenities'] ?? [])
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): void
    {
        $stmt = $this->db->prepare(
            'UPDATE hotels
             SET name = ?, city = ?, star_rating = ?, image_url = ?, amenities = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?'
        );
        $stmt->execute([
            $data['name'],
            $data['city']        ?? null,
            $data['star_rating'] ?? 5,
            $data['image_url']   ?? null,
            json_encode($data['amenities'] ?? []),
            $id
        ]);
    }

    public function delete(int $id): void
    {
        $stmt = $this->db->prepare('DELETE FROM hotels WHERE id = ?');
        $stmt->execute([$id]);
    }

    private function buildWhere(array $filters): array
    {
        $where  = '';
        $params = [];

        if (!empty($filters['search'])) {
            $where   .= ' AND (name LIKE ? OR city LIKE ?)';
            $params[] = '%' . $filters['search'] . '%';
            $params[] = '%' . $filters['search'] . '%';
        }

        if (!empty($filters['city'])) {
            $where   .= ' AND city = ?';
            $params[] = $filters['city'];
        }

        return [$where, $params];
    }

    private function decode(array $row): array
    {
        foreach ($this->jsonFields as $field) {
            if (isset($row[$field]) && is_string($row[$field])) {
                $row[$field] = json_decode($row[$field], true) ?? [];
            }
        }
        return $row;
    }
}
