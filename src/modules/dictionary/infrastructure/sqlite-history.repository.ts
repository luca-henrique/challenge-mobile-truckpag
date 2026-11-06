import * as Crypto from 'expo-crypto';
import { IHistoryRepository, HistoryItem } from '../domain/repositories/history.repository.interface';
import { getDatabase } from '../../../core/storage/database';

export class SQLiteHistoryRepository implements IHistoryRepository {
  async addToHistory(userId: string, word: string): Promise<void> {
    const cleanWord = word.trim().toLowerCase();
    const db = await getDatabase();
    const id = Crypto.randomUUID();
    const viewedAt = new Date().toISOString();

    // Remove registro anterior da mesma palavra para mantê-la no topo mais recente
    await db.runAsync(
      'DELETE FROM history WHERE user_id = ? AND word = ?',
      [userId, cleanWord]
    );

    await db.runAsync(
      'INSERT INTO history (id, user_id, word, viewed_at) VALUES (?, ?, ?, ?)',
      [id, userId, cleanWord, viewedAt]
    );
  }

  async getHistory(userId: string, limit = 50, offset = 0): Promise<HistoryItem[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{ id: string; word: string; viewed_at: string }>(
      'SELECT id, word, viewed_at FROM history WHERE user_id = ? ORDER BY viewed_at DESC LIMIT ? OFFSET ?',
      [userId, limit, offset]
    );

    return rows.map((r) => ({
      id: r.id,
      word: r.word,
      viewedAt: r.viewed_at,
    }));
  }

  async clearHistory(userId: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM history WHERE user_id = ?', [userId]);
  }
}

