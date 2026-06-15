<?php

declare(strict_types=1);

class SettingsModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function all(): array
    {
        $stmt = $this->db->prepare('SELECT key, value FROM settings ORDER BY key ASC');
        $stmt->execute();
        $rows   = $stmt->fetchAll();
        $result = [];
        foreach ($rows as $row) {
            $result[$row['key']] = $row['value'];
        }
        return $result;
    }

    public function bulkUpdate(array $items): void
    {
        $stmt = $this->db->prepare(
            'INSERT INTO settings (key, value, updated_at)
             VALUES (?, ?, CURRENT_TIMESTAMP)
             ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP'
        );
        foreach ($items as $key => $value) {
            $stmt->execute([$key, $value]);
        }
    }
}
