BEGIN;

ALTER TABLE solitude_journals DROP COLUMN categoryid;

DROP TABLE IF EXISTS solitude_date_categories;

COMMIT;