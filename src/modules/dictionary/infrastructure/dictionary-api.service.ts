import { IDictionaryService } from '../domain/services/dictionary.service.interface';
import { WordDetail } from '../domain/entities/dictionary-word';

export class DictionaryApiService implements IDictionaryService {
  private readonly baseUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en';

  async fetchWordDetail(word: string): Promise<WordDetail | null> {
    const cleanWord = word.trim().toLowerCase();
    if (!cleanWord) return null;

    try {
      const response = await fetch(`${this.baseUrl}/${encodeURIComponent(cleanWord)}`);

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`Erro na API do Dicionário: status ${response.status}`);
      }

      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        return null;
      }

      const entry = data[0];

      // Encontra a melhor transcrição fonética e áudio
      let bestPhonetic = entry.phonetic || '';
      let bestAudio = '';

      if (Array.isArray(entry.phonetics)) {
        for (const p of entry.phonetics) {
          if (!bestPhonetic && p.text) {
            bestPhonetic = p.text;
          }
          if (!bestAudio && p.audio && p.audio.trim().length > 0) {
            bestAudio = p.audio;
          }
        }
      }

      const wordDetail: WordDetail = {
        word: entry.word || cleanWord,
        phonetic: bestPhonetic || undefined,
        phonetics: Array.isArray(entry.phonetics) ? entry.phonetics : [],
        meanings: Array.isArray(entry.meanings) ? entry.meanings : [],
      };

      return wordDetail;
    } catch (err: any) {
      if (err.message && err.message.includes('404')) {
        return null;
      }
      throw err;
    }
  }
}

