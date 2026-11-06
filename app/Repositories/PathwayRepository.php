<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Core\Database;

final class PathwayRepository
{
    public function all(): array
    {
        return Database::connection()->query(
            'SELECT id, name, slug, description FROM pathways WHERE is_active = 1 ORDER BY name'
        )->fetchAll();
    }

    public function findBySlug(string $slug): ?array
    {
        $statement = Database::connection()->prepare(
            'SELECT id, name, slug, description FROM pathways WHERE slug = :slug AND is_active = 1 LIMIT 1'
        );
        $statement->execute(['slug' => $slug]);
        $pathway = $statement->fetch();
        if (!$pathway) {
            return null;
        }

        $skills = Database::connection()->prepare(
            'SELECT id, name, description, sort_order, resource_url FROM pathway_skills WHERE pathway_id = :pathway_id ORDER BY sort_order, id'
        );
        $skills->execute(['pathway_id' => $pathway['id']]);
        $pathway['skills'] = $skills->fetchAll();
        return $pathway;
    }
}
