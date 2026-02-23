-- =========================================
-- SERATIF 2026 - Database Schema
-- =========================================

CREATE DATABASE IF NOT EXISTS seratif2026
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE seratif2026;

-- =========================================
-- Table: users
-- =========================================
CREATE TABLE users (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  uuid           VARCHAR(36)  NOT NULL,
  full_name      VARCHAR(150) NOT NULL,
  email          VARCHAR(191) NOT NULL,
  password_hash  VARCHAR(255) NOT NULL,
  phone_number   VARCHAR(20)  NOT NULL,
  address        TEXT         NOT NULL,
  school_origin  VARCHAR(200) NOT NULL,
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT uq_users_uuid  UNIQUE (uuid),
  CONSTRAINT uq_users_email UNIQUE (email)
) ENGINE=InnoDB;

CREATE INDEX idx_users_uuid  ON users (uuid);
CREATE INDEX idx_users_email ON users (email);

-- =========================================
-- Table: payments
-- =========================================
CREATE TABLE payments (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         INT UNSIGNED NOT NULL,
  screenshot_path VARCHAR(500) NOT NULL,
  status          ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  approved_at     TIMESTAMP    NULL,

  CONSTRAINT fk_payments_user FOREIGN KEY (user_id)
    REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_payments_user_id ON payments (user_id);
CREATE INDEX idx_payments_status  ON payments (status);

-- =========================================
-- Table: admins
-- =========================================
CREATE TABLE admins (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(80)  NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT uq_admins_username UNIQUE (username)
) ENGINE=InnoDB;

-- =========================================
-- Seed: default admin account
-- password: Admin@Seratif2026  (change immediately in production)
-- =========================================
INSERT INTO admins (username, password_hash)
VALUES ('superadmin', '$2y$12$KIXeQzAEBo5x0VDYEtFJ4.mQyb3W4YpA2r6l8.Zh0bIMtsMTY9d9C');
-- Re-hash on first deploy: password_hash('Admin@Seratif2026', PASSWORD_BCRYPT)
