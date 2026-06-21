-- Self-heal accidental repeated currency symbols ("$$500M" -> "$500M") in stored
-- CMS content. Idempotent: each statement only touches rows that still contain a
-- doubled symbol, so re-running on a clean database is a no-op. The '$$' literals
-- sit inside single quotes, so they are plain strings (not Postgres dollar-quotes).
UPDATE "Singleton" SET data  = replace(data::text,  '$$', '$')::jsonb WHERE data::text  LIKE '%$$%';
UPDATE "Singleton" SET draft = replace(draft::text, '$$', '$')::jsonb WHERE draft IS NOT NULL AND draft::text LIKE '%$$%';
UPDATE "Platform"  SET data  = replace(data::text,  '$$', '$')::jsonb WHERE data::text  LIKE '%$$%';
UPDATE "Platform"  SET draft = replace(draft::text, '$$', '$')::jsonb WHERE draft IS NOT NULL AND draft::text LIKE '%$$%';
