export interface Phonetic {
  text?: string;
  audio?: string;
}

export interface Definition {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

export interface WordDetail {
  word: string;
  phonetic?: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
}

export interface HistoryItem {
  id?: string;
  userId?: string;
  word: string;
  viewedAt: string;
}

export interface FavoriteItem {
  id?: string;
  userId?: string;
  word: string;
  createdAt: string;
}
