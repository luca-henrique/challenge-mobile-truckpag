import { IWordRepository } from '../domain/repositories/word.repository.interface';
import { getDatabase } from '../../../core/storage/database';

export class SQLiteWordRepository implements IWordRepository {
  async getWords(limit = 60, offset = 0, search?: string): Promise<string[]> {
    const db = await getDatabase();
    if (search && search.trim().length > 0) {
      const term = `${search.trim().toLowerCase()}%`;
      const rows = await db.getAllAsync<{ word: string }>(
        'SELECT word FROM words WHERE word LIKE ? ORDER BY word ASC LIMIT ? OFFSET ?',
        [term, limit, offset]
      );
      return rows.map((r) => r.word);
    }

    const rows = await db.getAllAsync<{ word: string }>(
      'SELECT word FROM words ORDER BY word ASC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows.map((r) => r.word);
  }

  async countWords(): Promise<number> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM words'
    );
    return result?.count ?? 0;
  }

  async populateInitialWords(words: string[]): Promise<number> {
    if (!words || words.length === 0) return 0;
    const db = await getDatabase();

    const chunkSize = 200;
    let inserted = 0;

    await db.withTransactionAsync(async () => {
      for (let i = 0; i < words.length; i += chunkSize) {
        const chunk = words.slice(i, i + chunkSize);
        const placeholders = chunk.map(() => '(?)').join(',');
        await db.runAsync(
          `INSERT OR IGNORE INTO words (word) VALUES ${placeholders}`,
          chunk
        );
        inserted += chunk.length;
      }
    });

    return inserted;
  }
}

