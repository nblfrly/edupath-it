<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Core\Database;

final class ProgressRepository
{
    public function progress(int $userId, string $slug): ?array
    {
        $pathway = Database::connection()->prepare('SELECT id, name, slug FROM pathways WHERE slug = :slug AND is_active = 1 LIMIT 1');
        $pathway->execute(['slug' => $slug]);
        $item = $pathway->fetch();
        if (!$item) {
            return null;
        }

        $follow = Database::connection()->prepare('SELECT id, status FROM user_pathways WHERE user_id = :user_id AND pathway_id = :pathway_id LIMIT 1');
        $follow->execute(['user_id' => $userId, 'pathway_id' => $item['id']]);
        $userPathway = $follow->fetch();

        $skills = Database::connection()->prepare(
            'SELECT ps.id, ps.name, ps.description, ps.sort_order, COALESCE(ups.is_completed, 0) AS is_completed
             FROM pathway_skills ps
             LEFT JOIN user_pathway_skill_progress ups ON ups.pathway_skill_id = ps.id AND ups.user_pathway_id = :user_pathway_id
             WHERE ps.pathway_id = :pathway_id ORDER BY ps.sort_order, ps.id'
        );
        $skills->execute(['user_pathway_id' => $userPathway['id'] ?? 0, 'pathway_id' => $item['id']]);
        $item['following'] = $userPathway !== false;
        $item['status'] = $userPathway['status'] ?? null;
        $item['skills'] = $skills->fetchAll();
        return $item;
    }

    public function follow(int $userId, string $slug): ?array
    {
        $pathway = Database::connection()->prepare('SELECT id FROM pathways WHERE slug = :slug AND is_active = 1 LIMIT 1');
        $pathway->execute(['slug' => $slug]);
        $item = $pathway->fetch();
        if (!$item) {
            return null;
        }

        $statement = Database::connection()->prepare(
            'INSERT INTO user_pathways (user_id, pathway_id) VALUES (:user_id, :pathway_id)
             ON DUPLICATE KEY UPDATE status = status'
        );
        $statement->execute(['user_id' => $userId, 'pathway_id' => $item['id']]);
        return $this->progress($userId, $slug);
    }

    public function updateSkill(int $userId, string $slug, int $skillId, bool $completed): ?array
    {
        $progress = $this->progress($userId, $slug);
        if ($progress === null || !$progress['following']) {
            return null;
        }
        $allowed = array_filter($progress['skills'], static fn (array $skill): bool => (int) $skill['id'] === $skillId);
        if ($allowed === []) {
            return null;
        }

        $follow = Database::connection()->prepare('SELECT id FROM user_pathways WHERE user_id = :user_id AND pathway_id = :pathway_id');
        $follow->execute(['user_id' => $userId, 'pathway_id' => $progress['id']]);
        $userPathwayId = (int) $follow->fetchColumn();
        $statement = Database::connection()->prepare(
            'INSERT INTO user_pathway_skill_progress (user_pathway_id, pathway_skill_id, is_completed, completed_at)
             VALUES (:user_pathway_id, :skill_id, :completed, CASE WHEN :completed_at = 1 THEN NOW() ELSE NULL END)
             ON DUPLICATE KEY UPDATE is_completed = VALUES(is_completed), completed_at = VALUES(completed_at)'
        );
        $statement->execute([
            'user_pathway_id' => $userPathwayId,
            'skill_id' => $skillId,
            'completed' => $completed ? 1 : 0,
            'completed_at' => $completed ? 1 : 0,
        ]);
        return $this->progress($userId, $slug);
    }
}
