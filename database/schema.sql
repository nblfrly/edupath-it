
CREATE DATABASE IF NOT EXISTS edupath_it
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE edupath_it;

-- 1. akun pengguna dan admin
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
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
        ON UPDATE CURRENT_TIMESTAMP
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
