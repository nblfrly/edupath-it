<?php
declare(strict_types=1);

use App\Controllers\AuthController;
use App\Core\Router;

/** @var Router $router */
$auth = new AuthController();

$router->get('/api/session', [$auth, 'session']);
$router->post('/api/auth/register', [$auth, 'register']);
$router->post('/api/auth/login', [$auth, 'login']);
$router->post('/api/auth/logout', [$auth, 'logout']);
