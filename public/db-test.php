
<?php

try {
    // Mengambil koneksi dari konfigurasi database
    $pdo = require __DIR__ . '/../config/database.php';

    // Menghitung jumlah tabel pada database aktif
    $stmt = $pdo->query(
        'SELECT COUNT(*) AS total
         FROM information_schema.tables
         WHERE table_schema = DATABASE()'
    );

    $result = $stmt->fetch();
    $totalTables = (int) $result['total'];

    echo '<h1>Koneksi database berhasil!</h1>';
    echo '<p>Database: edupath_it</p>';
    echo '<p>Jumlah tabel: ' . $totalTables . '</p>';

} catch (Throwable $e) {
    http_response_code(500);

    // Catat rincian error di log
    error_log($e->getMessage());

    echo '<h1>Koneksi database gagal</h1>';
    echo '<p>Periksa konfigurasi koneksi database.</p>';
}
