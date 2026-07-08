<?php

declare(strict_types=1);

class CruiseCabinModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function byCruise(int $cruiseId): array
    {
        $stmt = $this->db->prepare('SELECT * FROM cruise_cabins WHERE cruise_id = ? ORDER BY id ASC');
        $stmt->execute([$cruiseId]);
        return array_map(fn($r) => $this->decode($r), $stmt->fetchAll());
    }

    public function bulkReplace(int $cruiseId, array $cabins): void
    {
        $del = $this->db->prepare('DELETE FROM cruise_cabins WHERE cruise_id = ?');
        $del->execute([$cruiseId]);

        $ins = $this->db->prepare(
            'INSERT INTO cruise_cabins (cruise_id, name, type, capacity, size, star_rating, image_url, amenities)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        );

        foreach ($cabins as $cabin) {
            $ins->execute([
                $cruiseId,
                $cabin['name']        ?? '',
                $cabin['type']        ?? '',
                $cabin['capacity']    ?? '',
                $cabin['size']        ?? '',
                $cabin['star_rating'] ?? 5,
                $cabin['image_url']   ?? null,
                json_encode($cabin['amenities'] ?? []),
            ]);
        }
    }

    public function delete(int $cabinId): bool
    {
        $stmt = $this->db->prepare('DELETE FROM cruise_cabins WHERE id = ?');
        $stmt->execute([$cabinId]);
        return $stmt->rowCount() > 0;
    }

    private function decode(array $row): array
    {
        if (isset($row['amenities']) && is_string($row['amenities'])) {
            $row['amenities'] = json_decode($row['amenities'], true) ?? [];
        }
        return $row;
    }
}
