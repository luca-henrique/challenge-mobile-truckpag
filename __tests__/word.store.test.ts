import { useWordStore } from '../src/modules/dictionary/presentation/state/useWordStore';
import { container } from '../src/core/di/container';
import { IWordRepository } from '../src/modules/dictionary/domain/repositories/word.repository.interface';
import { IFavoriteRepository } from '../src/modules/dictionary/domain/repositories/favorite.repository.interface';
import { IHistoryRepository } from '../src/modules/dictionary/domain/repositories/history.repository.interface';

describe('useWordStore Unit Tests', () => {
  let mockWordRepo: jest.Mocked<IWordRepository>;
  let mockFavRepo: jest.Mocked<IFavoriteRepository>;
  let mockHistoryRepo: jest.Mocked<IHistoryRepository>;

  beforeEach(() => {
    mockWordRepo = {
      getWords: jest.fn().mockResolvedValue(['hello', 'today', 'great']),
      populateInitialWords: jest.fn().mockResolvedValue(3),
      countWords: jest.fn().mockResolvedValue(3),
    };

    mockFavRepo = {
      addFavorite: jest.fn().mockResolvedValue(undefined),
      removeFavorite: jest.fn().mockResolvedValue(undefined),
      isFavorite: jest.fn().mockResolvedValue(false),
      getFavorites: jest.fn().mockResolvedValue(['hello']),
    };

    mockHistoryRepo = {
      addToHistory: jest.fn().mockResolvedValue(undefined),
      getHistory: jest.fn().mockResolvedValue([{ id: 'h1', word: 'hello', viewedAt: '2026-11-05T00:00:00Z' }]),
      clearHistory: jest.fn().mockResolvedValue(undefined),
    };

    container.setWordRepository(mockWordRepo);
    container.setFavoriteRepository(mockFavRepo);
    container.setHistoryRepository(mockHistoryRepo);

    useWordStore.setState({
      activeTab: 'words',
      words: ['hello', 'today', 'great'],
      history: [],
      favorites: [],
      selectedWord: null,
      page: 1,
      isLoadingWords: false,
      hasMoreWords: true,
      searchTerm: '',
    });
  });

  afterEach(() => {
    container.reset();
  });

  it('deve alternar abas corretamente', () => {
    useWordStore.getState().setActiveTab('favorites');
    expect(useWordStore.getState().activeTab).toBe('favorites');

    useWordStore.getState().setActiveTab('history');
    expect(useWordStore.getState().activeTab).toBe('history');
  });

  it('deve selecionar palavra e navegar com selectNextWord e selectPreviousWord', () => {
    useWordStore.getState().selectWord('hello');
    expect(useWordStore.getState().selectedWord).toBe('hello');

    useWordStore.getState().selectNextWord();
    expect(useWordStore.getState().selectedWord).toBe('today');

    useWordStore.getState().selectNextWord();
    expect(useWordStore.getState().selectedWord).toBe('great');

    useWordStore.getState().selectPreviousWord();
    expect(useWordStore.getState().selectedWord).toBe('today');
  });

  it('deve adicionar e remover favorito atualizando o estado', async () => {
    // Adiciona favorito
    const added = await useWordStore.getState().toggleFavorite('user-1', 'today');
    expect(added).toBe(true);
    expect(useWordStore.getState().isWordFavorite('today')).toBe(true);
    expect(mockFavRepo.addFavorite).toHaveBeenCalledWith('user-1', 'today');

    // Remove favorito
    const removed = await useWordStore.getState().toggleFavorite('user-1', 'today');
    expect(removed).toBe(false);
    expect(useWordStore.getState().isWordFavorite('today')).toBe(false);
    expect(mockFavRepo.removeFavorite).toHaveBeenCalledWith('user-1', 'today');
  });

  it('deve registrar visualização no histórico', async () => {
    await useWordStore.getState().recordWordView('user-1', 'peace');

    expect(mockHistoryRepo.addToHistory).toHaveBeenCalledWith('user-1', 'peace');
    const history = useWordStore.getState().history;
    expect(history.length).toBe(1);
    expect(history[0].word).toBe('peace');
  });

  it('deve limpar histórico do usuário', async () => {
    useWordStore.setState({
      history: [{ word: 'peace', viewedAt: '2026-11-05T00:00:00Z' }],
    });

    await useWordStore.getState().clearHistory('user-1');
    expect(mockHistoryRepo.clearHistory).toHaveBeenCalledWith('user-1');
    expect(useWordStore.getState().history).toEqual([]);
  });
});

