-- ECOCLEAN SL operates exclusively within Sierra Leone with four active roles.
SET @administrator_role_id := (SELECT id FROM roles WHERE code='ADMINISTRATOR' LIMIT 1);
UPDATE users u JOIN roles r ON r.id=u.role_id
SET u.role_id=@administrator_role_id,u.status='disabled'
WHERE r.code='NATIONAL_ADMIN';
DELETE FROM roles WHERE code='NATIONAL_ADMIN';

INSERT INTO countries(name,iso_code,status)
VALUES('Sierra Leone','SL','active')
ON DUPLICATE KEY UPDATE name=VALUES(name),status='active';
UPDATE countries SET status=IF(iso_code='SL','active','inactive');

INSERT INTO municipalities(name,code) VALUES
('Bo District Council','BDC'),('Bombali District Council','BOMDC'),('Bonthe District Council','BONDC'),
('Falaba District Council','FALDC'),('Kailahun District Council','KAIDC'),('Kambia District Council','KAMDC'),
('Karene District Council','KARDC'),('Kenema District Council','KENDC'),('Koinadugu District Council','KOIDC'),
('Kono District Council','KONDC'),('Moyamba District Council','MOYDC'),('Port Loko District Council','PLDC'),
('Pujehun District Council','PUJDC'),('Tonkolili District Council','TONDC'),
('Freetown City Council','FCC'),('Western Area Rural District Council','WARD-C')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO districts(municipality_id,name,code)
SELECT m.id,d.name,d.code FROM municipalities m JOIN (
 SELECT 'BDC' municipality_code,'Bo District' name,'BO' code UNION ALL
 SELECT 'BOMDC','Bombali District','BOM' UNION ALL SELECT 'BONDC','Bonthe District','BON' UNION ALL
 SELECT 'FALDC','Falaba District','FAL' UNION ALL SELECT 'KAIDC','Kailahun District','KAI' UNION ALL
 SELECT 'KAMDC','Kambia District','KAM' UNION ALL SELECT 'KARDC','Karene District','KAR' UNION ALL
 SELECT 'KENDC','Kenema District','KEN' UNION ALL SELECT 'KOIDC','Koinadugu District','KOI' UNION ALL
 SELECT 'KONDC','Kono District','KON' UNION ALL SELECT 'MOYDC','Moyamba District','MOY' UNION ALL
 SELECT 'PLDC','Port Loko District','PL' UNION ALL SELECT 'PUJDC','Pujehun District','PUJ' UNION ALL
 SELECT 'TONDC','Tonkolili District','TON' UNION ALL SELECT 'FCC','Western Area Urban','WAU' UNION ALL
 SELECT 'WARD-C','Western Area Rural','WAR'
) d ON d.municipality_code=m.code
ON DUPLICATE KEY UPDATE name=VALUES(name),municipality_id=VALUES(municipality_id);

INSERT IGNORE INTO country_municipalities(country_id,municipality_id)
SELECT c.id,m.id FROM countries c JOIN municipalities m WHERE c.iso_code='SL';
