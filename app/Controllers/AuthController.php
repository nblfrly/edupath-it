<?php
declare(strict_types=1);
namespace App\Controllers;
use App\Core\JsonResponse;
use App\Core\Request;
use App\Middleware\AuthMiddleware;
use App\Services\AuthService;
final class AuthController
{
    public function __construct(private readonly AuthService $auth = new AuthService()) {}
    public function session(): never
    {
        JsonResponse::send([
            'data' => ['user' => $_SESSION['user'] ?? null],
            'csrfToken' => $_SESSION['csrf_token'],
        ]);
    }
    public function register(): never
    {
        AuthMiddleware::csrf();
        $input = Request::json();
        $name = trim((string) ($input['name'] ?? ''));
        $email = filter_var((string) ($input['email'] ?? ''), FILTER_VALIDATE_EMAIL);
        $password = (string) ($input['password'] ?? '');
        if (mb_strlen($name) < 2 || $email === false || !self::strongPassword($password)) {
            JsonResponse::send(['message' => 'Data pendaftaran tidak valid.'], 422);
        }
        try {
            $user = $this->auth->register($name, strtolower($email), $password);
        } catch (\DomainException $exception) {
            JsonResponse::send(['message' => $exception->getMessage()], 422);
        }
        $this->startSession($user);
        JsonResponse::send([
            'data' => ['user' => $user],
            'csrfToken' => $_SESSION['csrf_token'],
        ], 201);
    }
    public function login(): never
    {
        AuthMiddleware::csrf();
        $input = Request::json();
        $email = filter_var((string) ($input['email'] ?? ''), FILTER_VALIDATE_EMAIL);
        $password = (string) ($input['password'] ?? '');
        if ($email === false || $password === '') {
            JsonResponse::send(['message' => 'Email atau kata sandi tidak valid.'], 422);
        }
        try {
            $user = $this->auth->login(strtolower($email), $password);
        } catch (\DomainException $exception) {
            JsonResponse::send(['message' => $exception->getMessage()], 401);
        }
        $this->startSession($user);
        JsonResponse::send([
            'data' => ['user' => $user],
            'csrfToken' => $_SESSION['csrf_token'],
        ]);
    }
    public function logout(): never
    {
        AuthMiddleware::csrf();
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', [
                'expires' => time() - 42000,
                'path' => $params['path'],
                'domain' => $params['domain'],
                'secure' => $params['secure'],
                'httponly' => $params['httponly'],
                'samesite' => $params['samesite'] ?? 'Lax',
            ]);
        }
        $_SESSION = [];
        session_destroy();
        JsonResponse::send(['data' => ['loggedOut' => true]]);
    }
    private function startSession(array $user): void
    {
        session_regenerate_id(true);
        $_SESSION['user'] = $user;
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    private static function strongPassword(string $password): bool
    {
        return strlen($password) >= 8
            && preg_match('/[A-Za-z]/', $password) === 1
            && preg_match('/\d/', $password) === 1;
    }
}
