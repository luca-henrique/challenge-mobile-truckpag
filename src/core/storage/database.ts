import * as SQLite from 'expo-sqlite';

let dbInstance: SQLite.SQLiteDatabase | null = null;
const DATABASE_NAME = 'truckpag_dictionary.db';

export async function importPrepopulatedDatabase(): Promise<void> {
  try {
    if (typeof (SQLite as any).importDatabaseFromAssetAsync === 'function') {
      const asset = require('../../../assets/database/dictionary.db');
      await (SQLite as any).importDatabaseFromAssetAsync(DATABASE_NAME, {
        assetId: asset,
        forceOverwrite: false,
      });
    }
  } catch {
    // Continua se já estiver importado ou em ambiente de teste/web
  }
}

export async function initDatabase(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      email TEXT UNIQUE COLLATE NOCASE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS words (
      word TEXT PRIMARY KEY COLLATE NOCASE
    );

    CREATE INDEX IF NOT EXISTS idx_words_word ON words(word COLLATE NOCASE);

    CREATE TABLE IF NOT EXISTS favorites (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      word TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(user_id, word),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);

    CREATE TABLE IF NOT EXISTS history (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      word TEXT NOT NULL,
      viewed_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_history_user_id ON history(user_id);
    CREATE INDEX IF NOT EXISTS idx_history_viewed_at ON history(viewed_at DESC);
  `);
}

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    await importPrepopulatedDatabase();
    dbInstance = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await initDatabase(dbInstance);
  }
  return dbInstance;
}

export function resetDatabaseInstance(): void {
  dbInstance = null;
}
