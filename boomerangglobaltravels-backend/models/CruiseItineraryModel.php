<?php

declare(strict_types=1);

class CruiseItineraryModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function byCruise(int $cruiseId): array
    {
        $stmt = $this->db->prepare('SELECT * FROM cruise_itinerary_days WHERE cruise_id = ? ORDER BY day_number ASC');
        $stmt->execute([$cruiseId]);
        return array_map(fn($r) => $this->decode($r), $stmt->fetchAll());
    }

    public function bulkReplace(int $cruiseId, array $days): void
    {
        $del = $this->db->prepare('DELETE FROM cruise_itinerary_days WHERE cruise_id = ?');
        $del->execute([$cruiseId]);

        $ins = $this->db->prepare(
            'INSERT INTO cruise_itinerary_days (cruise_id, day_number, title, city, description, meals, transport)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        );

        foreach ($days as $i => $day) {
            $ins->execute([
                $cruiseId,
                $day['day_number']  ?? ($i + 1),
                $day['title']        ?? '',
                $day['city']         ?? '',
                $day['description']  ?? '',
                json_encode($day['meals']     ?? []),
                json_encode($day['transport'] ?? []),
            ]);
        }
    }

    public function delete(int $dayId): bool
    {
        $stmt = $this->db->prepare('DELETE FROM cruise_itinerary_days WHERE id = ?');
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
