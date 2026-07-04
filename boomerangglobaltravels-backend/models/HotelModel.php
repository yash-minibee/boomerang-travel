<?php

declare(strict_types=1);

class HotelModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function byPackage(int $packageId): array
    {
        $stmt = $this->db->prepare('SELECT * FROM package_hotels WHERE package_id = ? ORDER BY id ASC');
        $stmt->execute([$packageId]);
        return array_map(fn($r) => $this->decode($r), $stmt->fetchAll());
    }

    public function bulkReplace(int $packageId, array $hotels): void
    {
        $del = $this->db->prepare('DELETE FROM package_hotels WHERE package_id = ?');
        $del->execute([$packageId]);

        $ins = $this->db->prepare(
            'INSERT INTO package_hotels (package_id, name, city, star_rating, image_url, amenities)
             VALUES (?, ?, ?, ?, ?, ?)'
        );

        foreach ($hotels as $hotel) {
            $ins->execute([
                $packageId,
                $hotel['name']        ?? '',
                $hotel['city']        ?? '',
                $hotel['star_rating'] ?? 5,
                $hotel['image_url']   ?? null,
                json_encode($hotel['amenities'] ?? []),
            ]);
        }
    }

    public function delete(int $hotelId): bool
    {
        $stmt = $this->db->prepare('DELETE FROM package_hotels WHERE id = ?');
        $stmt->execute([$hotelId]);
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
