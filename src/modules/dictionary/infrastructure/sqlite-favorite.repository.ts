import * as Crypto from 'expo-crypto';
import { IFavoriteRepository } from '../domain/repositories/favorite.repository.interface';
import { getDatabase } from '../../../core/storage/database';

export class SQLiteFavoriteRepository implements IFavoriteRepository {
  async addFavorite(userId: string, word: string): Promise<void> {
    const cleanWord = word.trim().toLowerCase();
    const db = await getDatabase();
    const id = Crypto.randomUUID();
    const createdAt = new Date().toISOString();

    await db.runAsync(
      `INSERT OR IGNORE INTO favorites (id, user_id, word, created_at)
       VALUES (?, ?, ?, ?)`,
      [id, userId, cleanWord, createdAt]
    );
  }

  async removeFavorite(userId: string, word: string): Promise<void> {
    const cleanWord = word.trim().toLowerCase();
    const db = await getDatabase();
    await db.runAsync(
      'DELETE FROM favorites WHERE user_id = ? AND word = ?',
      [userId, cleanWord]
    );
  }

  async isFavorite(userId: string, word: string): Promise<boolean> {
    const cleanWord = word.trim().toLowerCase();
    const db = await getDatabase();
    const row = await db.getFirstAsync<{ id: string }>(
      'SELECT id FROM favorites WHERE user_id = ? AND word = ?',
      [userId, cleanWord]
    );
    return !!row;
  }

  async getFavorites(userId: string, limit = 50, offset = 0): Promise<string[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{ word: string }>(
      'SELECT word FROM favorites WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [userId, limit, offset]
    );
    return rows.map((r) => r.word);
  }
}

