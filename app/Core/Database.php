<?php

declare(strict_types=1);

namespace App\Core;

use PDO;

final class Database
{
    private static ?PDO $connection = null;

    public static function connection(): PDO
    {
        if (self::$connection === null) {
            /** @var PDO $connection */
            $connection = require dirname(__DIR__, 2) . '/config/database.php';
            self::$connection = $connection;
        }

        return self::$connection;
    }
}
