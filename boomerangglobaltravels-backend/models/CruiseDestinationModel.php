<?php

declare(strict_types=1);

class CruiseDestinationModel
{
    private PDO $db;
    private array $jsonFields = ['highlights', 'gallery'];

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function count(array $filters = []): int
    {
        [$where, $params] = $this->buildWhere($filters);
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM cruise_destinations WHERE deleted_at IS NULL {$where}");
        $stmt->execute($params);
        return (int) $stmt->fetchColumn();
    }

    public function all(array $filters = [], int $limit = 10, int $offset = 0): array
    {
        [$where, $params] = $this->buildWhere($filters);
        $params[] = $limit;
        $params[] = $offset;

        $stmt = $this->db->prepare(
            "SELECT * FROM cruise_destinations WHERE deleted_at IS NULL {$where} ORDER BY featured DESC, name ASC LIMIT ? OFFSET ?"
        );
        $stmt->execute($params);
        return array_map(fn($r) => $this->decode($r), $stmt->fetchAll());
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM cruise_destinations WHERE id = ? AND deleted_at IS NULL LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? $this->decode($row) : null;
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO cruise_destinations (name, country, region, hero_image, description, highlights, gallery, featured, created_by, updated_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $data['name'],
            $data['country']    ?? null,
            $data['region']     ?? null,
            $data['hero_image'] ?? null,
            $data['description'] ?? null,
            json_encode($data['highlights'] ?? []),
            json_encode($data['gallery']    ?? []),
            $data['featured']   ?? 0,
            $data['created_by'] ?? null,
            $data['updated_by'] ?? null,
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $allowed = ['name', 'country', 'region', 'hero_image', 'description', 'highlights', 'gallery', 'featured', 'updated_by'];
        $fields  = [];
        $params  = [];

        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $fields[] = "{$field} = ?";
                $val = $data[$field];
                if (in_array($field, $this->jsonFields, true) && is_array($val)) {
                    $val = json_encode($val);
                }
                $params[] = $val;
            }
        }

        if (empty($fields)) {
            return false;
        }

        $fields[]  = 'updated_at = CURRENT_TIMESTAMP';
        $params[]  = $id;
        $fieldsSql = implode(', ', $fields);

        $stmt = $this->db->prepare("UPDATE cruise_destinations SET {$fieldsSql} WHERE id = ? AND deleted_at IS NULL");
        $stmt->execute($params);
        return $stmt->rowCount() > 0;
    }

    public function softDelete(int $id): bool
    {
        $stmt = $this->db->prepare('UPDATE cruise_destinations SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL');
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }

    public function refreshCruiseCounts(): void
    {
        $stmt = $this->db->prepare(
            "UPDATE cruise_destinations SET cruise_count = (
                SELECT COUNT(*) FROM cruises
                WHERE cruises.cruise_destination_id = cruise_destinations.id
                AND cruises.deleted_at IS NULL
            )"
        );
        $stmt->execute();
    }

    private function buildWhere(array $filters): array
    {
        $where = '';
        $params = [];

        if (!empty($filters['search'])) {
            $where   .= ' AND (name LIKE ? OR country LIKE ?)';
            $params[] = '%' . $filters['search'] . '%';
            $params[] = '%' . $filters['search'] . '%';
        }
        if (!empty($filters['region'])) {
            $where   .= ' AND region = ?';
            $params[] = $filters['region'];
        }
        if (isset($filters['featured']) && $filters['featured'] !== '') {
            $where   .= ' AND featured = ?';
            $params[] = (int) $filters['featured'];
        }

        return [$where, $params];
    }

    private function decode(array $row): array
    {
        foreach ($this->jsonFields as $f) {
            if (isset($row[$f]) && is_string($row[$f])) {
                $row[$f] = json_decode($row[$f], true) ?? [];
            }
        }
        return $row;
    }
}
