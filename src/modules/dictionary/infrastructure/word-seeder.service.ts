import AsyncStorage from '@react-native-async-storage/async-storage';
import { WIREFRAME_SEED_WORDS } from './seed-words';
import { container } from '../../../core/di/container';

const FULL_SEEDED_KEY = '@truckpag:dictionary_full_seeded_v1';

export class WordSeederService {
  private static isSeedingInProgress = false;

  public static async seedInitialWordsIfNeeded(): Promise<void> {
    const wordRepo = container.wordRepository;
    const count = await wordRepo.countWords();

    if (count === 0) {
      await wordRepo.populateInitialWords(WIREFRAME_SEED_WORDS);
    }
  }

  public static async seedFullDictionaryInBackground(): Promise<void> {
    if (this.isSeedingInProgress) return;

    try {
      const isAlreadySeeded = await AsyncStorage.getItem(FULL_SEEDED_KEY);
      if (isAlreadySeeded === 'true') {
        return;
      }

      this.isSeedingInProgress = true;

      // Importa dinamicamente para não travar a inicialização do app
      const dictionaryData = require('../../../../assets/words_dictionary.json');
      const allWords = Object.keys(dictionaryData);

      // Insere em lotes de 1.000 para manter a memória e o banco fluidos
      const batchSize = 1000;
      const wordRepo = container.wordRepository;

      for (let i = 0; i < allWords.length; i += batchSize) {
        const batch = allWords.slice(i, i + batchSize);
        await wordRepo.populateInitialWords(batch);
        // Cede tempo para a thread do JS entre lotes
        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      await AsyncStorage.setItem(FULL_SEEDED_KEY, 'true');
    } catch (error) {
      console.warn('Erro ao popular dicionário completo em background:', error);
    } finally {
      this.isSeedingInProgress = false;
    }
  }
}

