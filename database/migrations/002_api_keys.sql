CREATE TABLE IF NOT EXISTS api_keys (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  owner_user_id BIGINT UNSIGNED NOT NULL,
  label VARCHAR(120) NOT NULL DEFAULT 'Developer SDK Key',
  key_prefix VARCHAR(24) NOT NULL,
  key_hash CHAR(64) NOT NULL UNIQUE,
  last_four CHAR(4) NOT NULL,
  last_used_at TIMESTAMP NULL,
  revoked_at TIMESTAMP NULL,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(owner_user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX(owner_user_id,revoked_at), INDEX(expires_at)
) ENGINE=InnoDB;
