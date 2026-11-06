export interface HistoryItem {
  id: string;
  word: string;
  viewedAt: string;
}

export interface IHistoryRepository {
  addToHistory(userId: string, word: string): Promise<void>;
  getHistory(userId: string, limit?: number, offset?: number): Promise<HistoryItem[]>;
  clearHistory(userId: string): Promise<void>;
}

