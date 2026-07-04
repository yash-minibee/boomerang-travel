<?php

declare(strict_types=1);

class TestimonialModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function allPublic(): array
    {
        $stmt = $this->db->prepare(
            "SELECT * FROM testimonials WHERE status = 'Approved' ORDER BY created_at DESC"
        );
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function all(): array
    {
        $stmt = $this->db->prepare('SELECT * FROM testimonials ORDER BY created_at DESC');
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM testimonials WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO testimonials (customer_name, customer_location, avatar_url, rating, package_name, review_text, status)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $data['customer_name'],
            $data['customer_location'] ?? null,
            $data['avatar_url']        ?? null,
            $data['rating']            ?? 5,
            $data['package_name']      ?? null,
            $data['review_text'],
            $data['status']            ?? 'Pending',
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function updateStatus(int $id, string $status): bool
    {
        $stmt = $this->db->prepare('UPDATE testimonials SET status = ? WHERE id = ?');
        $stmt->execute([$status, $id]);
        return $stmt->rowCount() > 0;
    }

    public function update(int $id, array $data): bool
    {
        $stmt = $this->db->prepare(
            'UPDATE testimonials
             SET customer_name = ?,
                 customer_location = ?,
                 rating = ?,
                 package_name = ?,
                 review_text = ?,
                 status = ?
             WHERE id = ?'
        );
        $stmt->execute([
            $data['customer_name'],
            $data['customer_location'] ?? null,
            $data['rating']            ?? 5,
            $data['package_name']      ?? null,
            $data['review_text'],
            $data['status']            ?? 'Pending',
            $id
        ]);
        return $stmt->rowCount() > 0;
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare('DELETE FROM testimonials WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }
}
