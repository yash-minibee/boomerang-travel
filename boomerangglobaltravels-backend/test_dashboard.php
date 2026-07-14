<?php
require 'api/bootstrap.php';
$ctrl = new DashboardController();
// mock AuthMiddleware::handle();
class MockAuthMiddleware {
    public static function handle() {}
}
// wait, AuthMiddleware is already defined, let's just bypass it or mock the session?
// Or we can just run the DB queries manually.
$db = Database::getInstance();
$q = fn(string $sql) => (int) $db->query($sql)->fetchColumn();
$data = [
    'total_hotels'        => $q("SELECT COUNT(*) FROM hotels"),
    'total_cruises'       => $q("SELECT COUNT(*) FROM cruises WHERE deleted_at IS NULL"),
    'total_cruise_destinations' => $q("SELECT COUNT(*) FROM cruise_destinations WHERE deleted_at IS NULL"),
    'total_cruise_cabins' => $q("SELECT COUNT(*) FROM cabins"),
];
echo json_encode($data);
