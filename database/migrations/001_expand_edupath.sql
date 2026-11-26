-- Untuk instalasi dengan enam tabel awal. Boleh dijalankan ulang.
USE edupath_it;

-- Seluruh perubahan pada users dijalankan dalam satu ALTER.
SET @ddl = IF(
    EXISTS (SELECT 1 FROM information_schema.columns
            WHERE table_schema = DATABASE() AND table_name = 'users' AND column_name = 'google_sub'),
    'DO 0',
    'ALTER TABLE users
    MODIFY COLUMN password_hash VARCHAR(255) NULL,
    ADD COLUMN google_sub VARCHAR(255) CHARACTER SET ascii COLLATE ascii_bin NULL,
    ADD UNIQUE KEY uq_users_google_sub (google_sub),
    ADD CONSTRAINT ck_users_login_method CHECK (password_hash IS NOT NULL OR google_sub IS NOT NULL)'
);
PREPARE edupath_change FROM @ddl;
EXECUTE edupath_change;
DEALLOCATE PREPARE edupath_change;

-- Seluruh perubahan pada programs dijalankan dalam satu ALTER.
SET @ddl = IF(
    EXISTS (SELECT 1 FROM information_schema.columns
            WHERE table_schema = DATABASE() AND table_name = 'programs' AND column_name = 'fee_type'),
    'DO 0',
    'ALTER TABLE programs
    ADD COLUMN fee_type ENUM(''unknown'', ''free'', ''paid'') NOT NULL DEFAULT ''unknown'',
    ADD COLUMN fee_amount DECIMAL(12,2) UNSIGNED NULL,
    ADD COLUMN fee_currency CHAR(3) NULL,
    ADD COLUMN duration_label VARCHAR(100) NULL,
    ADD COLUMN schedule_type ENUM(''unknown'', ''self_paced'', ''scheduled'') NOT NULL DEFAULT ''unknown'',
    ADD COLUMN registration_status ENUM(''unknown'', ''upcoming'', ''open'', ''closed'') NOT NULL DEFAULT ''unknown'',
    ADD COLUMN requirements TEXT NULL,
    ADD COLUMN verified_at DATETIME NULL,
    ADD CONSTRAINT ck_program_fee CHECK (
        (fee_amount IS NULL AND fee_currency IS NULL)
        OR (fee_type = ''free'' AND fee_amount = 0 AND fee_amount IS NOT NULL AND fee_currency IS NULL)
        OR (fee_type = ''paid'' AND fee_amount > 0 AND fee_amount IS NOT NULL AND fee_currency IS NOT NULL)
    )'
);
PREPARE edupath_change FROM @ddl;
EXECUTE edupath_change;
DEALLOCATE PREPARE edupath_change;

-- Seluruh perubahan pada pathways dijalankan dalam satu ALTER.
SET @ddl = IF(
    EXISTS (SELECT 1 FROM information_schema.columns
            WHERE table_schema = DATABASE() AND table_name = 'pathways' AND column_name = 'source_url'),
    'DO 0',
    'ALTER TABLE pathways
    ADD COLUMN source_url VARCHAR(500) NULL'
);
PREPARE edupath_change FROM @ddl;
EXECUTE edupath_change;
DEALLOCATE PREPARE edupath_change;

-- Satu program dapat muncul di beberapa jalur karier.
CREATE TABLE IF NOT EXISTS program_pathways (
    program_id BIGINT UNSIGNED NOT NULL,
    pathway_id BIGINT UNSIGNED NOT NULL,
    relevance_note VARCHAR(255) NULL,
    PRIMARY KEY (program_id, pathway_id),
    KEY ix_program_pathways_pathway (pathway_id, program_id),
    CONSTRAINT fk_program_pathways_program
        FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    CONSTRAINT fk_program_pathways_pathway
        FOREIGN KEY (pathway_id) REFERENCES pathways(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Satu pengiriman yang selesai disimpan sekaligus, tanpa berkas atau isi PDF.
CREATE TABLE IF NOT EXISTS cv_reviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    pathway_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    score_1 TINYINT UNSIGNED NOT NULL,
    score_2 TINYINT UNSIGNED NULL,
    score_3 TINYINT UNSIGNED NULL,
    check_count TINYINT UNSIGNED GENERATED ALWAYS AS
        (1 + (score_2 IS NOT NULL) + (score_3 IS NOT NULL)) STORED,
    average_score DECIMAL(5,2) GENERATED ALWAYS AS
        ((score_1 + COALESCE(score_2, 0) + COALESCE(score_3, 0)) / check_count) STORED,
    feedback JSON NOT NULL,
    KEY ix_cv_reviews_user_date (user_id, created_at, id),
    CONSTRAINT fk_cv_reviews_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_cv_reviews_pathway
        FOREIGN KEY (pathway_id) REFERENCES pathways(id),
    CONSTRAINT ck_cv_review_scores CHECK (
        score_1 <= 100 AND (score_2 IS NULL OR score_2 <= 100)
        AND (score_3 IS NULL OR (score_2 IS NOT NULL AND score_3 <= 100))
    ),
    CONSTRAINT ck_cv_feedback_object CHECK (JSON_TYPE(feedback) = 'OBJECT')
) ENGINE=InnoDB;

-- Antrean kurasi, terpisah dari program yang ditampilkan kepada pengguna.
CREATE TABLE IF NOT EXISTS program_candidates (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    source_key BINARY(32) NOT NULL,
    source_url VARCHAR(500) NOT NULL,
    program_id BIGINT UNSIGNED NULL,
    proposed_data JSON NOT NULL,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    discovered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_by BIGINT UNSIGNED NULL,
    reviewed_at DATETIME NULL,
    UNIQUE KEY uq_candidate_source_key (source_key),
    KEY ix_candidate_queue (status, discovered_at),
    CONSTRAINT fk_candidate_program
        FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE SET NULL,
    CONSTRAINT fk_candidate_reviewer
        FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT ck_candidate_object CHECK (JSON_TYPE(proposed_data) = 'OBJECT')
) ENGINE=InnoDB;
