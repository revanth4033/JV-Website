import { execSync } from 'node:child_process'

if (!process.env.DATABASE_URI) {
  console.log('[db-deploy] No DATABASE_URI in this environment — skipping migrations.')
  process.exit(0)
}

const ENV = { ...process.env, PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK: '1' }

function prismaExec(cmd, captureStderr = false) {
  const stderrMode = captureStderr ? 'pipe' : 'inherit'
  execSync(`node_modules/.bin/prisma ${cmd}`, { stdio: ['inherit', 'inherit', stderrMode], env: ENV })
}

// Run a SQL file directly. Uses the unpooled URL when available to avoid
// PgBouncer limitations on DDL statements.
function runSQLFile(filePath) {
  const url = ENV.DATABASE_URL_UNPOOLED || ENV.POSTGRES_URL_NON_POOLING || ENV.DATABASE_URI
  execSync(
    `node_modules/.bin/prisma db execute --file "${filePath}" --url "${url}"`,
    { stdio: 'inherit', env: ENV }
  )
}

try {
  prismaExec('migrate deploy', true)
} catch (e) {
  const stderr = e?.stderr ? e.stderr.toString() : ''
  if (stderr) process.stderr.write(stderr)

  if (stderr.includes('P3005')) {
    // Database has objects (e.g. Neon system schemas) but no migration history.
    // Baseline 0_init so migrate deploy only applies the newer migrations.
    console.log('[db-deploy] P3005: baselining 0_init and re-applying.')
    prismaExec('migrate resolve --applied 0_init')
    prismaExec('migrate deploy')
  } else if (stderr.includes('P3009')) {
    // A previous interrupted deploy left a migration stuck in "failed" state.
    const match = stderr.match(/The `([^`]+)` migration started at .+ failed/)
    if (!match) throw e
    const migration = match[1]
    console.log(`[db-deploy] P3009: rolling back failed migration: ${migration}`)
    prismaExec(`migrate resolve --rolled-back "${migration}"`)
    // 0_init was baselined but never actually ran — its tables were never created.
    // Run the SQL directly (all statements use IF NOT EXISTS so this is safe).
    console.log('[db-deploy] Running 0_init SQL directly to create missing tables.')
    runSQLFile('prisma/migrations/0_init/migration.sql')
    prismaExec('migrate deploy')
  } else {
    throw e
  }
}
