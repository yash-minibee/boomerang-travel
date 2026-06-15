<?php

declare(strict_types=1);

class ItineraryModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function byPackage(int $packageId): array
    {
        $stmt = $this->db->prepare('SELECT * FROM itinerary_days WHERE package_id = ? ORDER BY day_number ASC');
        $stmt->execute([$packageId]);
        return array_map(fn($r) => $this->decode($r), $stmt->fetchAll());
    }

    public function bulkReplace(int $packageId, array $days): void
    {
        $del = $this->db->prepare('DELETE FROM itinerary_days WHERE package_id = ?');
        $del->execute([$packageId]);

        $ins = $this->db->prepare(
            'INSERT INTO itinerary_days (package_id, day_number, title, city, description, hotel, meals, transport)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        );

        foreach ($days as $i => $day) {
            $ins->execute([
                $packageId,
                $day['day_number'] ?? ($i + 1),
                $day['title']      ?? '',
                $day['city']       ?? '',
                $day['description'] ?? '',
                $day['hotel']      ?? '',
                json_encode($day['meals']     ?? []),
                json_encode($day['transport'] ?? []),
            ]);
        }
    }

    public function delete(int $dayId): bool
    {
        $stmt = $this->db->prepare('DELETE FROM itinerary_days WHERE id = ?');
        $stmt->execute([$dayId]);
        return $stmt->rowCount() > 0;
    }

    private function decode(array $row): array
    {
        foreach (['meals', 'transport'] as $f) {
            if (isset($row[$f]) && is_string($row[$f])) {
                $row[$f] = json_decode($row[$f], true) ?? [];
            }
        }
        return $row;
    }
}
