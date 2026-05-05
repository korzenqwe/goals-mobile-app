import {
  openDatabaseAsync,
  type SQLiteDatabase,
} from 'expo-sqlite'

import {
  migrations,
} from '@/shared/db/migrations'
import {
  DATABASE_NAME,
} from '@/shared/db/schema'

let databasePromise: Promise<SQLiteDatabase> | null = null

export async function getDatabaseAsync() {
  databasePromise ??= openDatabaseAsync(DATABASE_NAME).then(async (database) => {
    await migrateDatabaseAsync(database)
    return database
  })

  return databasePromise
}

async function migrateDatabaseAsync(database: SQLiteDatabase) {
  await database.execAsync('PRAGMA foreign_keys = ON;')
  await database.execAsync('PRAGMA journal_mode = WAL;')

  const versionRow = await database.getFirstAsync<{ user_version: number }>('PRAGMA user_version;')
  const currentVersion = versionRow?.user_version ?? 0

  for (const migration of migrations) {
    if (migration.id <= currentVersion) {
      continue
    }

    await database.withTransactionAsync(async () => {
      await database.execAsync(migration.sql)
      await database.execAsync(`PRAGMA user_version = ${migration.id};`)
    })
  }
}
