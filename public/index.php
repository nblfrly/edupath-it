<?php
declare(strict_types=1);

use App\Core\JsonResponse;
use App\Core\Router;

spl_autoload_register(static function (string $class): void {
    $prefix = 'App\\';
    if (!str_starts_with($class, $prefix)) {
        return;
    }
    $path = dirname(__DIR__) . '/app/' . str_replace('\\', '/', substr($class, strlen($prefix))) . '.php';
    if (is_file($path)) {
        require $path;
    }
});

ini_set('session.use_strict_mode', '1');
session_set_cookie_params([
    'httponly' => true,
    'samesite' => 'Lax',
    'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
]);

session_start();
$_SESSION['csrf_token'] ??= bin2hex(random_bytes(32));

$uriPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$basePath = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '')), '/');

if ($basePath !== '' && $basePath !== '/' && str_starts_with($uriPath, $basePath)) {
    $uriPath = substr($uriPath, strlen($basePath)) ?: '/';
}

if (str_starts_with($uriPath, '/api/')) {
    try {
        $router = new Router();
        require dirname(__DIR__) . '/routes/api.php';
        $router->dispatch($_SERVER['REQUEST_METHOD'] ?? 'GET', $uriPath);
    } catch (Throwable $exception) {
        error_log($exception->getMessage());
        JsonResponse::send(['message' => 'Terjadi gangguan pada layanan.'], 500);
    }
}

JsonResponse::send(['message' => 'Endpoint tidak ditemukan.'], 404);
