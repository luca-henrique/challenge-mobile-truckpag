import * as SQLite from 'expo-sqlite';

let dbInstance: SQLite.SQLiteDatabase | null = null;
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;
const DATABASE_NAME = 'truckpag_dictionary.db';

export async function importPrepopulatedDatabase(): Promise<void> {
  return Promise.resolve();
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

  try {
    const columns = await db.getAllAsync<{ name: string }>('PRAGMA table_info(users);');
    const hasSalt = Array.isArray(columns) && columns.some((col) => col.name === 'salt');
    if (!hasSalt) {
      await db.execAsync('ALTER TABLE users ADD COLUMN salt TEXT;');
    }
  } catch {
    // Ignora se não for possível consultar table_info
  }

  await db.execAsync(`
    INSERT OR REPLACE INTO users (id, name, email, password_hash, salt, created_at) VALUES
      ('user-admin-truckpag', 'Admin TruckPag', 'admin@truckpag.com', '07cdfe6930c4337d36fb3641c65480cf31d5fda46d9ba720171296e25a2a614a', '3755ecde-6918-431a-98e2-a764ca07525d', '2026-11-06T00:00:00.000Z'),
      ('user-dev-truckpag', 'Lucas Developer', 'user@truckpag.com', '94455c054c29ab224222a2f565e280f08a071b5bbdaf48a366f34211cc3293dd', 'f5efd56a-8576-4807-8991-4f455d135c37', '2026-11-06T00:00:00.000Z');

    INSERT OR IGNORE INTO favorites (id, user_id, word, created_at) VALUES
      ('fav-seed-1', 'user-admin-truckpag', 'hello', '2026-11-06T00:00:00.000Z'),
      ('fav-seed-2', 'user-admin-truckpag', 'peace', '2026-11-06T00:01:00.000Z'),
      ('fav-seed-3', 'user-admin-truckpag', 'great', '2026-11-06T00:02:00.000Z'),
      ('fav-seed-4', 'user-dev-truckpag', 'value', '2026-11-06T00:00:00.000Z'),
      ('fav-seed-5', 'user-dev-truckpag', 'common', '2026-11-06T00:01:00.000Z');

    INSERT OR IGNORE INTO history (id, user_id, word, viewed_at) VALUES
      ('hist-seed-1', 'user-admin-truckpag', 'hello', '2026-11-06T00:00:00.000Z'),
      ('hist-seed-2', 'user-admin-truckpag', 'today', '2026-11-06T00:01:00.000Z'),
      ('hist-seed-3', 'user-dev-truckpag', 'watch', '2026-11-06T00:00:00.000Z'),
      ('hist-seed-4', 'user-dev-truckpag', 'review', '2026-11-06T00:01:00.000Z');
  `);
}

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) return dbInstance;
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
      await initDatabase(db);
      dbInstance = db;
      return db;
    })().catch((err) => {
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
}

export function resetDatabaseInstance(): void {
  dbInstance = null;
  dbPromise = null;
}
