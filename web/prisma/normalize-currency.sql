-- Self-heal accidental repeated currency symbols ("$$500M" -> "$500M") in stored
-- CMS content. Idempotent: only rows that still contain a doubled symbol change,
-- so re-running on a clean database is a no-op.
--
-- chr(36) is "$". We build the pattern/replacement from chr() so this file never
-- contains a literal "$$" token, which Postgres/Prisma could otherwise read as a
-- dollar-quote delimiter and mis-parse. The pattern "[$]{2,}" puts "$" inside a
-- character class so it matches a literal dollar (not the regex end-anchor).
UPDATE "Singleton" SET data  = regexp_replace(data::text,  '[' || chr(36) || ']{2,}', chr(36), 'g')::jsonb WHERE position(chr(36) || chr(36) in data::text)  > 0;
UPDATE "Singleton" SET draft = regexp_replace(draft::text, '[' || chr(36) || ']{2,}', chr(36), 'g')::jsonb WHERE draft IS NOT NULL AND position(chr(36) || chr(36) in draft::text) > 0;
UPDATE "Platform"  SET data  = regexp_replace(data::text,  '[' || chr(36) || ']{2,}', chr(36), 'g')::jsonb WHERE position(chr(36) || chr(36) in data::text)  > 0;
UPDATE "Platform"  SET draft = regexp_replace(draft::text, '[' || chr(36) || ']{2,}', chr(36), 'g')::jsonb WHERE draft IS NOT NULL AND position(chr(36) || chr(36) in draft::text) > 0;
