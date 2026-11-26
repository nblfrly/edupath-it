
CREATE DATABASE IF NOT EXISTS edupath_it
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE edupath_it;

-- 1. akun pengguna dan admin
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    google_sub VARCHAR(255) CHARACTER SET ascii COLLATE ascii_bin NULL,
    UNIQUE KEY uq_users_google_sub (google_sub),
    CONSTRAINT ck_users_login_method CHECK (password_hash IS NOT NULL OR google_sub IS NOT NULL)
) ENGINE=InnoDB;

-- 2. direktori bootcamp, beasiswa, dan pelatihan
CREATE TABLE programs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    provider_name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    mode ENUM('online', 'offline', 'hybrid') DEFAULT 'online',
    location VARCHAR(150) NULL,
    deadline DATE NULL,
    source_url VARCHAR(500) NULL,
    registration_url VARCHAR(500) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by BIGINT UNSIGNED NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    fee_type ENUM('unknown', 'free', 'paid') NOT NULL DEFAULT 'unknown',
    fee_amount DECIMAL(12,2) UNSIGNED NULL,
    fee_currency CHAR(3) NULL,
    duration_label VARCHAR(100) NULL,
    schedule_type ENUM('unknown', 'self_paced', 'scheduled') NOT NULL DEFAULT 'unknown',
    registration_status ENUM('unknown', 'upcoming', 'open', 'closed') NOT NULL DEFAULT 'unknown',
    requirements TEXT NULL,
    verified_at DATETIME NULL,
    CONSTRAINT ck_program_fee CHECK (
        (fee_amount IS NULL AND fee_currency IS NULL)
        OR (fee_type = 'free' AND fee_amount = 0 AND fee_amount IS NOT NULL AND fee_currency IS NULL)
        OR (fee_type = 'paid' AND fee_amount > 0 AND fee_amount IS NOT NULL AND fee_currency IS NOT NULL)
    ),

    CONSTRAINT fk_program_creator
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

-- 3. daftar jalur karier IT
CREATE TABLE pathways (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(170) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
    source_url VARCHAR(500) NULL
) ENGINE=InnoDB;

-- 4. skill yang perlu dipelajari pada setiap jalur
CREATE TABLE pathway_skills (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pathway_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    resource_url VARCHAR(500) NULL,

    CONSTRAINT fk_skill_pathway
        FOREIGN KEY (pathway_id)
        REFERENCES pathways(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. jalur karier yang diikuti pengguna
CREATE TABLE user_pathways (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    pathway_id BIGINT UNSIGNED NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('in_progress', 'completed')
        NOT NULL DEFAULT 'in_progress',

    UNIQUE KEY uq_user_pathway (user_id, pathway_id),

    CONSTRAINT fk_up_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_up_pathway
        FOREIGN KEY (pathway_id)
        REFERENCES pathways(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. progres skill pengguna
CREATE TABLE user_pathway_skill_progress (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_pathway_id BIGINT UNSIGNED NOT NULL,
    pathway_skill_id BIGINT UNSIGNED NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at DATETIME NULL,

    UNIQUE KEY uq_progress_skill (
        user_pathway_id,
        pathway_skill_id
    ),

    CONSTRAINT fk_progress_user_pathway
        FOREIGN KEY (user_pathway_id)
        REFERENCES user_pathways(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_progress_skill
        FOREIGN KEY (pathway_skill_id)
        REFERENCES pathway_skills(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- Satu program dapat muncul di beberapa jalur karier.
CREATE TABLE program_pathways (
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
CREATE TABLE cv_reviews (
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

-- Kunci per akun membuat dua penyimpanan serentak memeriksa kapasitas secara berurutan.
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS check_cv_review_capacity(IN target_user_id BIGINT UNSIGNED)
BEGIN
    DECLARE locked_user_id BIGINT UNSIGNED;
    DECLARE review_count BIGINT UNSIGNED;

    SELECT id INTO locked_user_id FROM users WHERE id = target_user_id FOR UPDATE;
    SELECT COUNT(*) INTO review_count FROM cv_reviews
        WHERE user_id = target_user_id LOCK IN SHARE MODE;

    IF review_count >= 5 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'History penuh. Hapus satu hasil review sebelum memulai review baru.';
    END IF;
END//

CREATE TRIGGER IF NOT EXISTS cv_reviews_check_insert BEFORE INSERT ON cv_reviews
FOR EACH ROW CALL check_cv_review_capacity(NEW.user_id)//

CREATE TRIGGER IF NOT EXISTS cv_reviews_check_owner BEFORE UPDATE ON cv_reviews
FOR EACH ROW
BEGIN
    IF NEW.user_id <> OLD.user_id THEN
        CALL check_cv_review_capacity(NEW.user_id);
    END IF;
END//
DELIMITER ;

-- Antrean kurasi, terpisah dari program yang ditampilkan kepada pengguna.
CREATE TABLE program_candidates (
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
