<?php
declare(strict_types=1);
namespace App\Middleware;
use App\Core\JsonResponse;
final class AuthMiddleware
{
    public static function userId(): int
    {
        $id = $_SESSION['user']['id'] ?? null;
        if (!is_int($id) && !ctype_digit((string) $id)) {
            JsonResponse::send(['message' => 'Silakan masuk terlebih dahulu.'], 401);
        }
        return (int) $id;
    }
    public static function admin(): int
    {
        $id = self::userId();
        if (($_SESSION['user']['role'] ?? '') !== 'admin') {
            JsonResponse::send(['message' => 'Akses admin diperlukan.'], 403);
        }
        return $id;
    }
    public static function csrf(): void
    {
        $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        $sessionToken = $_SESSION['csrf_token'] ?? '';
        if (!is_string($token) || !is_string($sessionToken) || $token === '' || $sessionToken === '' || !hash_equals($sessionToken, $token)) {
            JsonResponse::send(['message' => 'Token keamanan tidak valid.'], 419);
        }
    }
}
