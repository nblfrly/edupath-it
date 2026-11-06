<?php

declare(strict_types=1);

namespace App\Services;

use App\Repositories\UserRepository;

final class AuthService
{
    public function __construct(private readonly UserRepository $users = new UserRepository()) {}

    public function register(string $name, string $email, string $password): array
    {
        if ($this->users->findByEmail($email) !== null) {
            throw new \DomainException('Email sudah terdaftar.');
        }

        $id = $this->users->create($name, $email, password_hash($password, PASSWORD_DEFAULT));
        return ['id' => $id, 'name' => $name, 'email' => $email, 'role' => 'user'];
    }

    public function login(string $email, string $password): array
    {
        $user = $this->users->findByEmail($email);
        if ($user === null || !password_verify($password, $user['password_hash'])) {
            throw new \DomainException('Email atau kata sandi tidak sesuai.');
        }

        return [
            'id' => (int) $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
        ];
    }
}
