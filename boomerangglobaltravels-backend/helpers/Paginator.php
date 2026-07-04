<?php

declare(strict_types=1);

class Paginator
{
    public static function paginate(int $total, int $page = 1, int $limit = 10): array
    {
        $limit = min(max($limit, 1), 100);
        $page  = max($page, 1);
        $totalPages = (int) ceil($total / $limit);
        $offset = ($page - 1) * $limit;

        return [
            'limit'       => $limit,
            'offset'      => $offset,
            'meta'        => [
                'page'        => $page,
                'limit'       => $limit,
                'total'       => $total,
                'total_pages' => $totalPages,
            ],
        ];
    }

    public static function fromRequest(): array
    {
        $page  = (int) ($_GET['page']  ?? 1);
        $limit = (int) ($_GET['limit'] ?? 10);
        return ['page' => max($page, 1), 'limit' => min(max($limit, 1), 100)];
    }
}
