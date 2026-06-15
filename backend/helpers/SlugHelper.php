<?php

declare(strict_types=1);

class SlugHelper
{
    public static function generate(string $title): string
    {
        $slug = strtolower(trim($title));
        $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
        $slug = preg_replace('/[\s-]+/', '-', $slug);
        return trim($slug, '-');
    }

    public static function unique(string $title, string $table, ?int $excludeId = null): string
    {
        $db   = Database::getInstance();
        $base = self::generate($title);
        $slug = $base;
        $i    = 2;

        while (true) {
            $sql    = "SELECT id FROM {$table} WHERE slug = ?";
            $params = [$slug];
            if ($excludeId !== null) {
                $sql    .= ' AND id != ?';
                $params[] = $excludeId;
            }
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            if (!$stmt->fetch()) {
                break;
            }
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
