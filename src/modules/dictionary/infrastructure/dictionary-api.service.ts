import { IDictionaryService } from '../domain/services/dictionary.service.interface';
import { WordDetail } from '../domain/entities/dictionary-word';
import { httpClient, HttpClientError } from '../../../shared/api/http-client';

export class DictionaryApiService implements IDictionaryService {
  private readonly baseUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en';

  async fetchWordDetail(word: string): Promise<WordDetail | null> {
    const cleanWord = word.trim().toLowerCase();
    if (!cleanWord) return null;

    try {
      const data = await httpClient<any[]>(`${this.baseUrl}/${encodeURIComponent(cleanWord)}`, {
        timeoutMs: 8000,
      });

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
    } catch (err: unknown) {
      if (err instanceof HttpClientError && err.status === 404) {
        return null;
      }
      throw err;
    }
  }
}

