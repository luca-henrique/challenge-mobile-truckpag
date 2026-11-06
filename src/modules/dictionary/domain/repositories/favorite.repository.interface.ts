export interface IFavoriteRepository {
  addFavorite(userId: string, word: string): Promise<void>;
  removeFavorite(userId: string, word: string): Promise<void>;
  isFavorite(userId: string, word: string): Promise<boolean>;
  getFavorites(userId: string, limit?: number, offset?: number): Promise<string[]>;
}

