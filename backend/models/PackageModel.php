<?php

declare(strict_types=1);

class PackageModel
{
    private PDO $db;
    private array $jsonFields = ['gallery', 'highlights', 'tags', 'inclusions', 'exclusions'];

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function count(array $filters = []): int
    {
        [$where, $params] = $this->buildWhere($filters);
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM packages p LEFT JOIN destinations d ON p.destination_id = d.id WHERE p.deleted_at IS NULL {$where}");
        $stmt->execute($params);
        return (int) $stmt->fetchColumn();
    }

    public function all(array $filters = [], int $limit = 10, int $offset = 0, string $sort = 'created_at', string $order = 'desc'): array
    {
        $allowed_sorts  = ['created_at', 'starting_price', 'title', 'rating'];
        $allowed_orders = ['asc', 'desc'];
        $sort  = in_array($sort, $allowed_sorts, true) ? $sort : 'created_at';
        $order = in_array($order, $allowed_orders, true) ? $order : 'desc';

        [$where, $params] = $this->buildWhere($filters);
        $params[] = $limit;
        $params[] = $offset;

        $stmt = $this->db->prepare(
            "SELECT p.id, p.title, p.slug, p.category, p.duration, p.starting_price,
                    p.status, p.featured, p.rating, p.review_count, p.cover_image, p.tags, p.highlights,
                    p.created_at, p.updated_at, p.destination_id,
                    d.name AS destination_name,
                    d.region AS destination_region
             FROM packages p
             LEFT JOIN destinations d ON p.destination_id = d.id
             WHERE p.deleted_at IS NULL {$where}
             ORDER BY p.{$sort} {$order}
             LIMIT ? OFFSET ?"
        );
        $stmt->execute($params);
        $rows = $stmt->fetchAll();
        return array_map(fn($r) => $this->decodeJson($r), $rows);
    }

    public function findBySlug(string $slug): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT p.*, d.name AS destination_name, d.region AS destination_region
             FROM packages p
             LEFT JOIN destinations d ON p.destination_id = d.id
             WHERE p.slug = ? AND p.deleted_at IS NULL LIMIT 1'
        );
        $stmt->execute([$slug]);
        $row = $stmt->fetch();
        return $row ? $this->decodeJson($row) : null;
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare(
            'SELECT p.*, d.name AS destination_name, d.region AS destination_region
             FROM packages p
             LEFT JOIN destinations d ON p.destination_id = d.id
             WHERE p.id = ? AND p.deleted_at IS NULL LIMIT 1'
        );
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? $this->decodeJson($row) : null;
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO packages
             (title, slug, category, destination_id, duration, starting_price, rating, review_count, status, featured,
              cover_image, gallery, highlights, tags, inclusions, exclusions,
              policy_cancellation, policy_refund, policy_payment,
              meta_title, meta_description, meta_keywords, created_by, updated_by)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
        );
        $stmt->execute([
            $data['title'],
            $data['slug'],
            $data['category']           ?? null,
            $data['destination_id']     ?? null,
            $data['duration']           ?? null,
            $data['starting_price']     ?? 0,
            $data['rating']             ?? 0,
            $data['review_count']       ?? 0,
            $data['status']             ?? 'draft',
            $data['featured']           ?? 0,
            $data['cover_image']        ?? null,
            json_encode($data['gallery']    ?? []),
            json_encode($data['highlights'] ?? []),
            json_encode($data['tags']       ?? []),
            json_encode($data['inclusions'] ?? []),
            json_encode($data['exclusions'] ?? []),
            $data['policy_cancellation'] ?? null,
            $data['policy_refund']       ?? null,
            $data['policy_payment']      ?? null,
            $data['meta_title']          ?? null,
            $data['meta_description']    ?? null,
            $data['meta_keywords']       ?? null,
            $data['created_by']          ?? null,
            $data['updated_by']          ?? null,
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $fields = [];
        $params = [];

        $allowed = ['title', 'slug', 'category', 'destination_id', 'duration', 'starting_price', 'rating', 'review_count',
                    'status', 'featured', 'cover_image', 'gallery', 'highlights', 'tags',
                    'inclusions', 'exclusions', 'policy_cancellation', 'policy_refund', 'policy_payment',
                    'meta_title', 'meta_description', 'meta_keywords', 'updated_by'];

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

        $stmt = $this->db->prepare("UPDATE packages SET {$fieldsSql} WHERE id = ? AND deleted_at IS NULL");
        $stmt->execute($params);
        return $stmt->rowCount() > 0;
    }

    public function softDelete(int $id): bool
    {
        $stmt = $this->db->prepare('UPDATE packages SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL');
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }

    public function toggleFeatured(int $id): ?array
    {
        $pkg = $this->findById($id);
        if (!$pkg) {
            return null;
        }
        $newVal = $pkg['featured'] ? 0 : 1;
        $stmt   = $this->db->prepare('UPDATE packages SET featured = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
        $stmt->execute([$newVal, $id]);
        return $this->findById($id);
    }

    private function buildWhere(array $filters): array
    {
        $where  = '';
        $params = [];

        if (!empty($filters['search'])) {
            $where   .= ' AND (p.title LIKE ? OR d.region LIKE ?)';
            $params[] = '%' . $filters['search'] . '%';
            $params[] = '%' . $filters['search'] . '%';
        }
        if (!empty($filters['destination'])) {
            $where   .= ' AND d.region = ?';
            $params[] = $filters['destination'];
        }
        if (!empty($filters['status'])) {
            $where   .= ' AND p.status = ?';
            $params[] = $filters['status'];
        }
        if (!empty($filters['category'])) {
            $where   .= ' AND p.category = ?';
            $params[] = $filters['category'];
        }
        if (isset($filters['featured']) && $filters['featured'] !== '') {
            $where   .= ' AND p.featured = ?';
            $params[] = (int) $filters['featured'];
        }

        return [$where, $params];
    }

    private function decodeJson(array $row): array
    {
        foreach ($this->jsonFields as $field) {
            if (isset($row[$field]) && is_string($row[$field])) {
                $row[$field] = json_decode($row[$field], true) ?? [];
            }
        }
        return $row;
    }
}
