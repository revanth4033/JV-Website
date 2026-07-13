import { execSync } from 'node:child_process'
import { writeFileSync, unlinkSync } from 'node:fs'

if (!process.env.DATABASE_URI) {
  console.log('[db-deploy] No DATABASE_URI in this environment — skipping migrations.')
  process.exit(0)
}

const ENV = { ...process.env, PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK: '1' }

function prismaExec(cmd) {
  execSync(`node_modules/.bin/prisma ${cmd}`, { stdio: 'inherit', env: ENV })
}

// Deletes a row from _prisma_migrations directly via SQL.
// Used when a migration is in "applied" state and cannot be rolled back via CLI.
function deleteMigrationRecord(migrationName) {
  const tmp = '/tmp/del-migration.sql'
  writeFileSync(tmp, `DELETE FROM "_prisma_migrations" WHERE migration_name = '${migrationName}';`)
  try {
    execSync(`node_modules/.bin/prisma db execute --file "${tmp}"`, { stdio: 'inherit', env: ENV })
  } finally {
    try { unlinkSync(tmp) } catch {}
  }
}

try {
  execSync('node_modules/.bin/prisma migrate deploy', { stdio: ['inherit', 'inherit', 'pipe'], env: ENV })
} catch (e) {
  const stderr = e?.stderr ? e.stderr.toString() : ''
  if (stderr) process.stderr.write(stderr)

  if (stderr.includes('P3005')) {
    console.log('[db-deploy] Existing schema without migration history — baselining 0_init, then re-applying.')
    prismaExec('migrate resolve --applied 0_init')
    prismaExec('migrate deploy')
  } else if (stderr.includes('P3009')) {
    // Previous interrupted deploy left a migration stuck in "failed" state.
    const match = stderr.match(/The `([^`]+)` migration started at .+ failed/)
    if (!match) throw e
    const migration = match[1]
    console.log(`[db-deploy] Rolling back failed migration: ${migration}`)
    prismaExec(`migrate resolve --rolled-back "${migration}"`)
    // 0_init was baselined (applied) on a fresh DB where tables were never created.
    // --rolled-back doesn't work on applied migrations, so delete the record directly.
    console.log('[db-deploy] Removing 0_init from migration history to recreate schema from scratch.')
    deleteMigrationRecord('0_init')
    prismaExec('migrate deploy')
  } else {
    throw e
  }
}
