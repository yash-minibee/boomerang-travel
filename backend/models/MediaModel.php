<?php

declare(strict_types=1);

class MediaModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function all(): array
    {
        $stmt = $this->db->prepare('SELECT * FROM media ORDER BY created_at DESC');
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM media WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO media (filename, original_name, file_path, file_size, mime_type)
             VALUES (?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $data['filename'],
            $data['original_name'],
            $data['file_path'],
            $data['file_size'],
            $data['mime_type'],
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare('DELETE FROM media WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->rowCount() > 0;
    }
}
