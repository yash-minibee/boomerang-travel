<?php

declare(strict_types=1);

class ContentModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function byPage(string $page): array
    {
        $stmt = $this->db->prepare('SELECT key, value FROM site_content WHERE page = ? ORDER BY key ASC');
        $stmt->execute([$page]);
        $rows   = $stmt->fetchAll();
        $result = [];
        foreach ($rows as $row) {
            $result[$row['key']] = $row['value'];
        }
        return $result;
    }

    public function bulkUpdate(string $page, array $items): void
    {
        $stmt = $this->db->prepare(
            'INSERT INTO site_content (page, key, value, updated_at)
             VALUES (?, ?, ?, CURRENT_TIMESTAMP)
             ON CONFLICT(page, key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP'
        );
        foreach ($items as $key => $value) {
            $stmt->execute([$page, $key, $value]);
        }
    }
}
