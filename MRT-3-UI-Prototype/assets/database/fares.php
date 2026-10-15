
<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../db.php';

try {
    $sql = "
        SELECT
            f.origin_station_id AS originId,
            f.destination_station_id AS destinationId,
            ft.type_name AS fareType,
            f.amount AS amount
        FROM fare f
        INNER JOIN fare_type ft
            ON ft.fare_type_id = f.fare_type_id
        INNER JOIN station origin
            ON origin.station_id = f.origin_station_id
        INNER JOIN station destination
            ON destination.station_id = f.destination_station_id
        WHERE origin.status = 'active'
          AND destination.status = 'active'
          AND f.effective_from <= CURDATE()
          AND (
              f.effective_to IS NULL
              OR f.effective_to >= CURDATE()
          )
        ORDER BY
            origin.sequence_order,
            destination.sequence_order,
            ft.fare_type_id
    ";

    $stmt = $pdo->query($sql);
    $fares = $stmt->fetchAll();

    foreach ($fares as &$fare) {
        $fare['originId'] = (int) $fare['originId'];
        $fare['destinationId'] = (int) $fare['destinationId'];
        $fare['amount'] = (float) $fare['amount'];
    }
    unset($fare);

    echo json_encode(['fares' => $fares]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Unable to retrieve fares. Check your database schema and PHP error log.'
    ]);
}
