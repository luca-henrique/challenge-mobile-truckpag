import { create } from 'zustand';
import { container } from '../../../../core/di/container';
import { WordSeederService } from '../../infrastructure/word-seeder.service';

export type TabType = 'words' | 'history' | 'favorites';

interface WordState {
  activeTab: TabType;
  words: string[];
  history: { word: string; viewedAt: string }[];
  favorites: string[];
  selectedWord: string | null;
  page: number;
  pageSize: number;
  isLoadingWords: boolean;
  hasMoreWords: boolean;
  searchTerm: string;

  // Ações
  setActiveTab: (tab: TabType) => void;
  setSearchTerm: (term: string) => void;
  loadInitialWords: () => Promise<void>;
  loadMoreWords: () => Promise<void>;
  loadFavorites: (userId: string) => Promise<void>;
  toggleFavorite: (userId: string, word: string) => Promise<boolean>;
  isWordFavorite: (word: string) => boolean;
  loadHistory: (userId: string) => Promise<void>;
  recordWordView: (userId: string, word: string) => Promise<void>;
  clearHistory: (userId: string) => Promise<void>;
  selectWord: (word: string | null) => void;
  selectNextWord: () => void;
  selectPreviousWord: () => void;
}

export const useWordStore = create<WordState>((set, get) => ({
  activeTab: 'words',
  words: [],
  history: [],
  favorites: [],
  selectedWord: null,
  page: 0,
  pageSize: 45,
  isLoadingWords: false,
  hasMoreWords: true,
  searchTerm: '',

  setActiveTab: (tab: TabType) => set({ activeTab: tab }),

  setSearchTerm: async (term: string) => {
    set({ searchTerm: term, page: 0, words: [], hasMoreWords: true, isLoadingWords: true });
    try {
      const items = await container.wordRepository.getWords(get().pageSize, 0, term);
      set({
        words: items,
        page: 1,
        hasMoreWords: items.length >= get().pageSize,
        isLoadingWords: false,
      });
    } catch {
      set({ isLoadingWords: false });
    }
  },

  loadInitialWords: async () => {
    try {
      set({ isLoadingWords: true });
      await WordSeederService.seedInitialWordsIfNeeded();
      const pageSize = get().pageSize;
      const initial = await container.wordRepository.getWords(pageSize, 0, get().searchTerm);
      set({
        words: initial,
        page: 1,
        hasMoreWords: initial.length >= pageSize,
        isLoadingWords: false,
      });

      // Em segundo plano, continua a carga completa do dicionário
      WordSeederService.seedFullDictionaryInBackground().catch(console.warn);
    } catch {
      set({ isLoadingWords: false });
    }
  },

  loadMoreWords: async () => {
    const { page, pageSize, isLoadingWords, hasMoreWords, words, searchTerm } = get();
    if (isLoadingWords || !hasMoreWords) return;

    try {
      set({ isLoadingWords: true });
      const offset = page * pageSize;
      const nextWords = await container.wordRepository.getWords(pageSize, offset, searchTerm);

      if (nextWords.length === 0) {
        set({ hasMoreWords: false, isLoadingWords: false });
        return;
      }

      set({
        words: [...words, ...nextWords],
        page: page + 1,
        hasMoreWords: nextWords.length >= pageSize,
        isLoadingWords: false,
      });
    } catch {
      set({ isLoadingWords: false });
    }
  },

  loadFavorites: async (userId: string) => {
    try {
      const favs = await container.favoriteRepository.getFavorites(userId, 100, 0);
      set({ favorites: favs });
    } catch (err) {
      console.warn('Erro ao carregar favoritos:', err);
    }
  },

  toggleFavorite: async (userId: string, word: string) => {
    const cleanWord = word.trim().toLowerCase();
    const isFav = get().isWordFavorite(cleanWord);
    try {
      if (isFav) {
        await container.favoriteRepository.removeFavorite(userId, cleanWord);
        set((state) => ({
          favorites: state.favorites.filter((w) => w !== cleanWord),
        }));
        return false;
      } else {
        await container.favoriteRepository.addFavorite(userId, cleanWord);
        set((state) => ({
          favorites: [cleanWord, ...state.favorites],
        }));
        return true;
      }
    } catch (err) {
      console.warn('Erro ao alternar favorito:', err);
      return isFav;
    }
  },

  isWordFavorite: (word: string) => {
    const cleanWord = word.trim().toLowerCase();
    return get().favorites.includes(cleanWord);
  },

  loadHistory: async (userId: string) => {
    try {
      const items = await container.historyRepository.getHistory(userId, 100, 0);
      set({ history: items });
    } catch (err) {
      console.warn('Erro ao carregar histórico:', err);
    }
  },

  recordWordView: async (userId: string, word: string) => {
    const cleanWord = word.trim().toLowerCase();
    try {
      await container.historyRepository.addToHistory(userId, cleanWord);
      // Atualiza lista em memória
      set((state) => {
        const filtered = state.history.filter((h) => h.word !== cleanWord);
        return {
          history: [{ word: cleanWord, viewedAt: new Date().toISOString() }, ...filtered],
        };
      });
    } catch (err) {
      console.warn('Erro ao salvar no histórico:', err);
    }
  },

  clearHistory: async (userId: string) => {
    try {
      await container.historyRepository.clearHistory(userId);
      set({ history: [] });
    } catch (err) {
      console.warn('Erro ao limpar histórico:', err);
    }
  },

  selectWord: (word: string | null) => {
    set({ selectedWord: word });
  },

  selectNextWord: () => {
    const { activeTab, words, favorites, history, selectedWord } = get();
    let currentList: string[] = [];

    if (activeTab === 'words') currentList = words;
    else if (activeTab === 'favorites') currentList = favorites;
    else if (activeTab === 'history') currentList = history.map((h) => h.word);

    if (currentList.length === 0 || !selectedWord) return;

    const currentIndex = currentList.indexOf(selectedWord);
    if (currentIndex >= 0 && currentIndex < currentList.length - 1) {
      set({ selectedWord: currentList[currentIndex + 1] });
    }
  },

  selectPreviousWord: () => {
    const { activeTab, words, favorites, history, selectedWord } = get();
    let currentList: string[] = [];

    if (activeTab === 'words') currentList = words;
    else if (activeTab === 'favorites') currentList = favorites;
    else if (activeTab === 'history') currentList = history.map((h) => h.word);

    if (currentList.length === 0 || !selectedWord) return;

    const currentIndex = currentList.indexOf(selectedWord);
    if (currentIndex > 0) {
      set({ selectedWord: currentList[currentIndex - 1] });
    }
  },
}));

