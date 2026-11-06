<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Core\Database;

final class ProgramRepository
{
    public function all(string $keyword = '', string $category = '', string $mode = '', bool $includeInactive = false): array
    {
        $conditions = [];
        $parameters = [];

        if (!$includeInactive) {
            $conditions[] = 'is_active = 1';
        }
        if ($keyword !== '') {
            $conditions[] = '(title LIKE :keyword OR provider_name LIKE :keyword OR category LIKE :keyword)';
            $parameters['keyword'] = '%' . $keyword . '%';
        }
        if ($category !== '') {
            $conditions[] = 'category = :category';
            $parameters['category'] = $category;
        }
        if ($mode !== '') {
            $conditions[] = 'mode = :mode';
            $parameters['mode'] = $mode;
        }

        $sql = 'SELECT * FROM programs';
        if ($conditions !== []) {
            $sql .= ' WHERE ' . implode(' AND ', $conditions);
        }
        $sql .= ' ORDER BY created_at DESC, id DESC';

        $statement = Database::connection()->prepare($sql);
        $statement->execute($parameters);
        return array_map([$this, 'toFrontend'], $statement->fetchAll());
    }

    public function find(int $id): ?array
    {
        $statement = Database::connection()->prepare('SELECT * FROM programs WHERE id = :id LIMIT 1');
        $statement->execute(['id' => $id]);
        $program = $statement->fetch();
        return $program ? $this->toFrontend($program) : null;
    }

    public function create(array $input, int $creatorId): array
    {
        $statement = Database::connection()->prepare(
            'INSERT INTO programs (title, provider_name, category, description, mode, source_url, registration_url, price, duration_value, duration_unit, status, created_by)
             VALUES (:title, :provider_name, :category, :description, :mode, :source_url, :registration_url, :price, :duration_value, :duration_unit, :status, :created_by)'
        );
        $statement->execute($this->toDatabase($input) + ['created_by' => $creatorId]);
        return $this->find((int) Database::connection()->lastInsertId());
    }

    public function update(int $id, array $input): ?array
    {
        $statement = Database::connection()->prepare(
            'UPDATE programs SET title = :title, provider_name = :provider_name, category = :category, description = :description,
             mode = :mode, source_url = :source_url, registration_url = :registration_url, price = :price,
             duration_value = :duration_value, duration_unit = :duration_unit, status = :status, is_active = :is_active
             WHERE id = :id'
        );
        $statement->execute($this->toDatabase($input) + ['id' => $id]);
        return $this->find($id);
    }

    public function delete(int $id): bool
    {
        $statement = Database::connection()->prepare('DELETE FROM programs WHERE id = :id');
        $statement->execute(['id' => $id]);
        return $statement->rowCount() === 1;
    }

    public function recommendationCatalog(string $budget, string $mode): array
    {
        $conditions = ['is_active = 1'];
        $parameters = [];
        if ($budget === 'free') {
            $conditions[] = 'COALESCE(price, 0) = 0';
        } elseif ($budget === 'paid') {
            $conditions[] = 'COALESCE(price, 0) > 0';
        }
        if ($mode !== 'any') {
            $conditions[] = 'mode = :mode';
            $parameters['mode'] = $mode;
        }

        $statement = Database::connection()->prepare(
            'SELECT id, title, provider_name, category, description, mode, price, duration_value, duration_unit, registration_url, source_url
             FROM programs WHERE ' . implode(' AND ', $conditions) . ' ORDER BY created_at DESC, id DESC LIMIT 40'
        );
        $statement->execute($parameters);
        return $statement->fetchAll();
    }

    private function toDatabase(array $input): array
    {
        $status = $input['status'] ?? 'draft';
        return [
            'title' => $input['nama'],
            'provider_name' => $input['penyedia'],
            'category' => $input['jalur'],
            'description' => $input['desc'] ?? '',
            'mode' => strtolower($input['mode'] ?? 'online'),
            'source_url' => $input['url'] ?: null,
            'registration_url' => $input['url'] ?: null,
            'price' => (int) ($input['biaya'] ?? 0),
            'duration_value' => max(1, (int) ($input['durasi'] ?? 1)),
            'duration_unit' => $input['satuan'] ?? 'bulan',
            'status' => $status,
            'is_active' => $status === 'active' ? 1 : 0,
        ];
    }

    private function toFrontend(array $program): array
    {
        $status = $program['status'] ?? ((int) $program['is_active'] === 1 ? 'active' : 'inactive');
        return [
            'id' => (int) $program['id'],
            'nama' => $program['title'],
            'penyedia' => $program['provider_name'],
            'jalur' => $program['category'],
            'biaya' => (int) ($program['price'] ?? 0),
            'durasi' => (int) ($program['duration_value'] ?? 1),
            'satuan' => $program['duration_unit'] ?? 'bulan',
            'mode' => ucfirst($program['mode'] ?? 'online'),
            'status' => match ($status) { 'active' => 'Aktif', 'draft' => 'Draf', default => 'Nonaktif' },
            'desc' => $program['description'],
            'url' => $program['registration_url'] ?: $program['source_url'] ?: '#',
            'tgl' => substr((string) $program['created_at'], 0, 10),
        ];
    }
}
