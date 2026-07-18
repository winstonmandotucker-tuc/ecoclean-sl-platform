CREATE TABLE IF NOT EXISTS countries (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, iso_code CHAR(2) NOT NULL UNIQUE, name VARCHAR(120) NOT NULL,
  status ENUM('active','planned','inactive') NOT NULL DEFAULT 'active', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS system_settings (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, setting_key VARCHAR(120) NOT NULL UNIQUE, value_json JSON NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT FALSE, updated_by BIGINT UNSIGNED NULL, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY(updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS audit_policies (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, event_type VARCHAR(100) NOT NULL UNIQUE, retention_days INT UNSIGNED NOT NULL DEFAULT 2555,
  enabled BOOLEAN NOT NULL DEFAULT TRUE, updated_by BIGINT UNSIGNED NULL, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY(updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS report_categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, code VARCHAR(60) NOT NULL UNIQUE, name VARCHAR(120) NOT NULL,
  default_priority ENUM('low','medium','high','critical') NOT NULL DEFAULT 'medium', active BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS report_history (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, report_id BIGINT UNSIGNED NOT NULL, actor_user_id BIGINT UNSIGNED NULL,
  action VARCHAR(80) NOT NULL, from_status VARCHAR(40) NULL, to_status VARCHAR(40) NULL, notes TEXT NULL,
  snapshot_json JSON NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(report_id) REFERENCES reports(id) ON DELETE CASCADE, FOREIGN KEY(actor_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX(report_id,created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS task_history (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, task_id BIGINT UNSIGNED NOT NULL, actor_user_id BIGINT UNSIGNED NULL,
  action VARCHAR(80) NOT NULL, from_status VARCHAR(40) NULL, to_status VARCHAR(40) NULL, notes TEXT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(task_id) REFERENCES tasks(id) ON DELETE CASCADE, FOREIGN KEY(actor_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX(task_id,created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS task_notes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, task_id BIGINT UNSIGNED NOT NULL, user_id BIGINT UNSIGNED NOT NULL,
  note TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(task_id) REFERENCES tasks(id) ON DELETE CASCADE, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX(task_id,created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS support_tickets (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, reference VARCHAR(50) NOT NULL UNIQUE, opened_by BIGINT UNSIGNED NOT NULL,
  assigned_to BIGINT UNSIGNED NULL, subject VARCHAR(190) NOT NULL, category VARCHAR(80) NOT NULL DEFAULT 'general',
  priority ENUM('low','medium','high','critical') NOT NULL DEFAULT 'medium', status ENUM('open','assigned','escalated','resolved','closed') NOT NULL DEFAULT 'open',
  resolution TEXT NULL, resolved_at TIMESTAMP NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY(opened_by) REFERENCES users(id) ON DELETE RESTRICT, FOREIGN KEY(assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  INDEX(opened_by,status), INDEX(assigned_to,status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS conversations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, ticket_id BIGINT UNSIGNED NULL, subject VARCHAR(190) NOT NULL,
  created_by BIGINT UNSIGNED NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY(ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE, FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX(ticket_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id BIGINT UNSIGNED NOT NULL, user_id BIGINT UNSIGNED NOT NULL, joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_read_at TIMESTAMP NULL, PRIMARY KEY(conversation_id,user_id),
  FOREIGN KEY(conversation_id) REFERENCES conversations(id) ON DELETE CASCADE, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS messages (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, conversation_id BIGINT UNSIGNED NOT NULL, sender_user_id BIGINT UNSIGNED NOT NULL,
  body TEXT NOT NULL, message_type ENUM('text','system','attachment') NOT NULL DEFAULT 'text', edited_at TIMESTAMP NULL, deleted_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(conversation_id) REFERENCES conversations(id) ON DELETE CASCADE, FOREIGN KEY(sender_user_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX(conversation_id,created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS uploads (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, public_id CHAR(36) NOT NULL DEFAULT (UUID()), owner_user_id BIGINT UNSIGNED NOT NULL,
  report_id BIGINT UNSIGNED NULL, task_id BIGINT UNSIGNED NULL, ticket_id BIGINT UNSIGNED NULL,
  purpose ENUM('report_evidence','task_evidence','profile_image','ticket_attachment') NOT NULL,
  original_name VARCHAR(255) NOT NULL, stored_name VARCHAR(255) NOT NULL UNIQUE, mime_type VARCHAR(100) NOT NULL,
  size_bytes BIGINT UNSIGNED NOT NULL, sha256 CHAR(64) NOT NULL, storage_disk VARCHAR(30) NOT NULL DEFAULT 'local', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(public_id), FOREIGN KEY(owner_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(report_id) REFERENCES reports(id) ON DELETE CASCADE, FOREIGN KEY(task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY(ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE, INDEX(owner_user_id,purpose), INDEX(report_id), INDEX(task_id), INDEX(ticket_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notification_deliveries (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, notification_id BIGINT UNSIGNED NOT NULL,
  channel ENUM('in_app','email','sms','push') NOT NULL DEFAULT 'in_app', status ENUM('queued','sent','delivered','failed','read') NOT NULL DEFAULT 'queued',
  provider_reference VARCHAR(190) NULL, attempted_at TIMESTAMP NULL, delivered_at TIMESTAMP NULL, failure_reason TEXT NULL,
  FOREIGN KEY(notification_id) REFERENCES notifications(id) ON DELETE CASCADE, INDEX(notification_id,channel,status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS announcements (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, created_by BIGINT UNSIGNED NOT NULL, title VARCHAR(190) NOT NULL, body TEXT NOT NULL,
  target_role VARCHAR(40) NULL, municipality_id BIGINT UNSIGNED NULL, published_at TIMESTAMP NULL, expires_at TIMESTAMP NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE RESTRICT, FOREIGN KEY(municipality_id) REFERENCES municipalities(id) ON DELETE SET NULL,
  INDEX(target_role,published_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS operational_states (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, state_key VARCHAR(120) NOT NULL UNIQUE, value_json JSON NOT NULL,
  updated_by BIGINT UNSIGNED NOT NULL, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY(updated_by) REFERENCES users(id) ON DELETE RESTRICT, INDEX(updated_at)
) ENGINE=InnoDB;

INSERT INTO countries(iso_code,name,status) VALUES ('SL','Sierra Leone','active') ON DUPLICATE KEY UPDATE name=VALUES(name);
INSERT INTO report_categories(code,name,default_priority) VALUES
('illegal_dumping','Illegal Dumping','high'),('overflowing_bin','Overflowing Waste Bin','medium'),
('hazardous_waste','Hazardous Waste','critical'),('drainage','Blocked Drainage','high'),('other','Other','medium')
ON DUPLICATE KEY UPDATE name=VALUES(name),default_priority=VALUES(default_priority);
INSERT INTO audit_policies(event_type,retention_days) VALUES
('authentication',2555),('report',2555),('task',2555),('support',2555),('upload',2555),('administration',3650)
ON DUPLICATE KEY UPDATE retention_days=VALUES(retention_days);
