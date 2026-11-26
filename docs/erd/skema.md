# Skema Relasional — EduPath IT

## A. Pemetaan ERD ke Relasional (Aturan 1–7)

| Bagian ERD | Aturan | Hasil pada Skema |
| :--- | :--- | :--- |
| Entitas kuat `users`, `pathways`, `programs`, `pathway_skills`, `program_candidates`, `cv_reviews` | Aturan 1 (Entitas kuat) | Masing-masing menjadi satu tabel sendiri dengan PK `id` (`BIGINT UNSIGNED AUTO_INCREMENT`) dan atribut atomik. |
| `users` mencatat `programs` (0..1 : 0..N) | Aturan 4 (Relasi 1:N) | FK `created_by` (`NULL`, `ON DELETE SET NULL`) ditambahkan pada tabel `programs` merujuk `users(id)`. |
| `users` meninjau `program_candidates` (0..1 : 0..N) | Aturan 4 (Relasi 1:N) | FK `reviewed_by` (`NULL`, `ON DELETE SET NULL`) ditambahkan pada tabel `program_candidates` merujuk `users(id)`. |
| `programs` terkait `program_candidates` (0..1 : 0..N) | Aturan 4 (Relasi 1:N) | FK `program_id` (`NULL`, `ON DELETE SET NULL`) ditambahkan pada tabel `program_candidates` merujuk `programs(id)`. |
| `pathways` memuat `pathway_skills` (1..1 : 0..N) | Aturan 4 (Relasi 1:N) | FK `pathway_id` (`NOT NULL`, `ON DELETE CASCADE`) ditambahkan pada tabel `pathway_skills` merujuk `pathways(id)`. |
| `users` menyimpan `cv_reviews` (1..1 : 0..N) | Aturan 4 (Relasi 1:N) | FK `user_id` (`NOT NULL`, `ON DELETE CASCADE`) ditambahkan pada tabel `cv_reviews` merujuk `users(id)`. |
| `pathways` menjadi target `cv_reviews` (1..1 : 0..N) | Aturan 4 (Relasi 1:N) | FK `pathway_id` (`NOT NULL`, `ON DELETE RESTRICT`) ditambahkan pada tabel `cv_reviews` merujuk `pathways(id)`. |
| `programs` dikaitkan ke `pathways` (M:N) | Aturan 5 (Relasi M:N) | Dibentuk tabel jembatan `program_pathways` dengan PK gabungan sekaligus FK `(program_id, pathway_id)` dan atribut relasi `relevance_note`. |
| `users` mengikuti `pathways` (M:N) | Aturan 5 (Relasi M:N) | Dibentuk tabel jembatan `user_pathways` dengan surrogate PK `id`, `UNIQUE(user_id, pathway_id)`, FK `user_id` & `pathway_id`, serta atribut relasi `started_at` dan `status`. |
| `user_pathways` mencatat progres `pathway_skills` (M:N) | Aturan 5 (Relasi M:N) | Dibentuk tabel jembatan `user_pathway_skill_progress` dengan surrogate PK `id`, `UNIQUE(user_pathway_id, pathway_skill_id)`, FK `user_pathway_id` & `pathway_skill_id`, serta atribut relasi `is_completed` dan `completed_at`. |

## B. Notasi Skema Relasional (9 Tabel)

1. `users(PK: id, name, email, password_hash, role, created_at, updated_at, google_sub)`
   FK: tidak ada (UNIQUE: `email`, `google_sub`)

2. `programs(PK: id, title, provider_name, category, description, mode, location, deadline, source_url, registration_url, is_active, FK: created_by, created_at, updated_at, fee_type, fee_amount, fee_currency, duration_label, schedule_type, registration_status, requirements, verified_at)`
   FK: `created_by` -> `users(id)`

3. `pathways(PK: id, name, slug, description, is_active, created_at, updated_at, source_url)`
   FK: tidak ada (UNIQUE: `slug`)

4. `pathway_skills(PK: id, FK: pathway_id, name, description, sort_order, resource_url)`
   FK: `pathway_id` -> `pathways(id)`

5. `user_pathways(PK: id, FK: user_id, FK: pathway_id, started_at, status)`
   FK: `user_id` -> `users(id)`; `pathway_id` -> `pathways(id)` (UNIQUE: `user_id, pathway_id`)

6. `user_pathway_skill_progress(PK: id, FK: user_pathway_id, FK: pathway_skill_id, is_completed, completed_at)`
   FK: `user_pathway_id` -> `user_pathways(id)`; `pathway_skill_id` -> `pathway_skills(id)` (UNIQUE: `user_pathway_id, pathway_skill_id`)

7. `program_pathways(PK/FK: program_id, PK/FK: pathway_id, relevance_note)`
   FK: `program_id` -> `programs(id)`; `pathway_id` -> `pathways(id)`

8. `cv_reviews(PK: id, FK: user_id, FK: pathway_id, created_at, score_1, score_2, score_3, check_count, average_score, feedback)`
   FK: `user_id` -> `users(id)`; `pathway_id` -> `pathways(id)`

9. `program_candidates(PK: id, source_key, source_url, FK: program_id, proposed_data, status, discovered_at, last_seen_at, FK: reviewed_by, reviewed_at)`
   FK: `program_id` -> `programs(id)`; `reviewed_by` -> `users(id)` (UNIQUE: `source_key`)