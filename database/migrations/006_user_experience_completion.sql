CREATE TABLE IF NOT EXISTS user_profiles (
  user_id BIGINT UNSIGNED PRIMARY KEY,
  address VARCHAR(255) NULL,
  emergency_contact_name VARCHAR(160) NULL,
  emergency_contact_phone VARCHAR(40) NULL,
  biography TEXT NULL,
  profile_upload_id BIGINT UNSIGNED NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(profile_upload_id) REFERENCES uploads(id) ON DELETE SET NULL,
  INDEX(profile_upload_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id BIGINT UNSIGNED PRIMARY KEY,
  theme ENUM('system','light','dark') NOT NULL DEFAULT 'system',
  language VARCHAR(20) NOT NULL DEFAULT 'en',
  notification_preferences_json JSON NULL,
  gis_preferences_json JSON NULL,
  dashboard_preferences_json JSON NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

ALTER TABLE uploads
  ADD COLUMN deleted_at TIMESTAMP NULL,
  ADD COLUMN replaced_by BIGINT UNSIGNED NULL,
  ADD INDEX uploads_active_owner(owner_user_id,deleted_at,purpose);

INSERT IGNORE INTO user_profiles(user_id) SELECT id FROM users;
INSERT IGNORE INTO user_preferences(user_id) SELECT id FROM users;

ALTER TABLE tasks MODIFY COLUMN status ENUM('assigned','accepted','in_progress','completed','verified','rejected','cancelled') DEFAULT 'assigned';
