<?php

declare(strict_types=1);

class DashboardController
{
    public function stats(): void
    {
        AuthMiddleware::handle();
        $db = Database::getInstance();

        $q = fn(string $sql) => (int) $db->query($sql)->fetchColumn();

        $data = [
            'total_packages'      => $q("SELECT COUNT(*) FROM packages WHERE deleted_at IS NULL"),
            'active_packages'     => $q("SELECT COUNT(*) FROM packages WHERE status = 'active' AND deleted_at IS NULL"),
            'total_destinations'  => $q("SELECT COUNT(*) FROM destinations WHERE deleted_at IS NULL"),
            'total_hotels'        => $q("SELECT COUNT(*) FROM hotels"),
            'total_inquiries'     => $q("SELECT COUNT(*) FROM inquiries"),
            'new_inquiries'       => $q("SELECT COUNT(*) FROM inquiries WHERE status = 'New'"),
            'total_cruises'       => $q("SELECT COUNT(*) FROM cruises WHERE deleted_at IS NULL"),
            'total_cruise_destinations' => $q("SELECT COUNT(*) FROM cruise_destinations WHERE deleted_at IS NULL"),
            'total_cruise_cabins' => $q("SELECT COUNT(*) FROM cabins"),
            'total_customers'     => $q("SELECT COUNT(*) FROM customers"),
            'total_testimonials'  => $q("SELECT COUNT(*) FROM testimonials"),
            'pending_testimonials'=> $q("SELECT COUNT(*) FROM testimonials WHERE status = 'Pending'"),
        ];

        // Monthly inquiries (last 6 months)
        $stmt = $db->prepare(
            "SELECT strftime('%Y-%m', created_at) as month, COUNT(*) as count
             FROM inquiries
             WHERE created_at >= date('now', '-6 months')
             GROUP BY month
             ORDER BY month ASC"
        );
        $stmt->execute();
        $data['monthly_inquiries'] = $stmt->fetchAll();

        Response::success($data);
    }

    public function revenue(): void
    {
        AuthMiddleware::handle();
        $db   = Database::getInstance();
        $stmt = $db->prepare(
            "SELECT strftime('%Y-%m', created_at) as month,
                    COUNT(*) as inquiries,
                    SUM(CASE WHEN status = 'Confirmed' THEN 1 ELSE 0 END) as confirmed
             FROM inquiries
             WHERE created_at >= date('now', '-6 months')
             GROUP BY month
             ORDER BY month ASC"
        );
        $stmt->execute();
        $rows = $stmt->fetchAll();

        // Attach package avg price as estimated revenue
        $pkgStmt = $db->prepare('SELECT AVG(starting_price) FROM packages WHERE deleted_at IS NULL');
        $pkgStmt->execute();
        $avgPrice = (float) $pkgStmt->fetchColumn();

        $result = [];
        foreach ($rows as $row) {
            $result[] = [
                'month'      => $row['month'],
                'inquiries'  => (int) $row['inquiries'],
                'confirmed'  => (int) $row['confirmed'],
                'revenue'    => round((int) $row['confirmed'] * $avgPrice, 2),
            ];
        }

        Response::success($result);
    }
}
