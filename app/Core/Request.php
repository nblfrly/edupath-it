<?php

declare(strict_types=1);

namespace App\Core;

final class Request
{
    public static function json(): array
    {
        $body = file_get_contents('php://input');
        if ($body === false || $body === '') {
            return [];
        }

        $data = json_decode($body, true);
        if (!is_array($data)) {
            JsonResponse::send(['message' => 'Format JSON tidak valid.'], 400);
        }

        return $data;
    }

    public static function query(string $key, string $default = ''): string
    {
        $value = $_GET[$key] ?? $default;
        return is_string($value) ? trim($value) : $default;
    }
}
