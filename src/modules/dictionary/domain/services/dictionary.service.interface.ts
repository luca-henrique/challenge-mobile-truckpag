import { WordDetail } from '../entities/dictionary-word';

export interface IDictionaryService {
  fetchWordDetail(word: string): Promise<WordDetail | null>;
}

