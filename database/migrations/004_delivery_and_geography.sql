CREATE TABLE IF NOT EXISTS country_municipalities (
  country_id BIGINT UNSIGNED NOT NULL, municipality_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY(country_id,municipality_id),
  FOREIGN KEY(country_id) REFERENCES countries(id) ON DELETE RESTRICT,
  FOREIGN KEY(municipality_id) REFERENCES municipalities(id) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT IGNORE INTO country_municipalities(country_id,municipality_id)
SELECT c.id,m.id FROM countries c,municipalities m WHERE c.iso_code='SL';

DROP TRIGGER IF EXISTS notifications_create_delivery;
CREATE TRIGGER notifications_create_delivery AFTER INSERT ON notifications
FOR EACH ROW INSERT INTO notification_deliveries(notification_id,channel,status,attempted_at,delivered_at)
VALUES(NEW.id,'in_app','delivered',NOW(),NOW());
