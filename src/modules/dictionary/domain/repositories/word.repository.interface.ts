export interface IWordRepository {
  getWords(limit: number, offset: number, search?: string): Promise<string[]>;
  populateInitialWords(words: string[]): Promise<number>;
  countWords(): Promise<number>;
}

