BEGIN;

ALTER TABLE solitude_date_categories DROP COLUMN userid;

ALTER TABLE solitude_journals DROP COLUMN userid;

DROP TABLE IF EXISTS solitude_users;

COMMIT;