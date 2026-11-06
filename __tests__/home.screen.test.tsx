import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { HomeScreen } from '../src/modules/dictionary/presentation/screens/HomeScreen';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../src/modules/auth/presentation/state/useAuthStore';
import { useWordStore } from '../src/modules/dictionary/presentation/state/useWordStore';
import { container } from '../src/core/di/container';

describe('HomeScreen Component Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
      },
    });

    container.setDictionaryService({
      fetchWordDetail: jest.fn().mockResolvedValue({
        word: 'today',
        phonetic: '/təˈdeɪ/',
        phonetics: [],
        meanings: [
          {
            partOfSpeech: 'noun',
            definitions: [{ definition: 'This present day' }],
          },
        ],
      }),
    });

    container.setFavoriteRepository({
      getFavorites: jest.fn().mockResolvedValue(['hello']),
      addFavorite: jest.fn().mockResolvedValue(undefined),
      removeFavorite: jest.fn().mockResolvedValue(undefined),
      isFavorite: jest.fn().mockResolvedValue(true),
    });

    container.setHistoryRepository({
      getHistory: jest.fn().mockResolvedValue([]),
      addToHistory: jest.fn().mockResolvedValue(undefined),
      clearHistory: jest.fn().mockResolvedValue(undefined),
    });

    container.setWordRepository({
      getWords: jest.fn().mockResolvedValue(['hello', 'today', 'great']),
      populateInitialWords: jest.fn().mockResolvedValue(3),
      countWords: jest.fn().mockResolvedValue(3),
    });

    useAuthStore.setState({
      user: {
        id: 'user-test-1',
        email: 'test@truckpag.com',
        name: 'Lucas Tester',
        createdAt: '2026-11-06T00:00:00Z',
      },
      isLoading: false,
      error: null,
      isGuest: false,
      initSession: jest.fn().mockResolvedValue(undefined),
    });

    useWordStore.setState({
      activeTab: 'words',
      words: ['hello', 'today', 'great'],
      history: [],
      favorites: ['hello'],
      selectedWord: null,
      page: 1,
      isLoadingWords: false,
      hasMoreWords: false,
      searchTerm: '',
      loadInitialWords: jest.fn().mockResolvedValue(undefined),
      loadFavorites: jest.fn().mockResolvedValue(undefined),
      loadHistory: jest.fn().mockResolvedValue(undefined),
      recordWordView: jest.fn().mockResolvedValue(undefined),
    });

    jest.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
    container.reset();
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  it('deve renderizar o cabeçalho, as 3 abas e o grid de palavras', async () => {
    const { getByText, getAllByText } = renderWithProviders(<HomeScreen />);

    // Cabeçalho
    expect(getByText('Free Dictionary')).toBeTruthy();
    expect(getByText('Lucas Tester')).toBeTruthy();

    // Abas do wireframe ('Word list' aparece na aba e no título da seção)
    expect(getAllByText('Word list').length).toBeGreaterThanOrEqual(1);
    expect(getByText('History')).toBeTruthy();
    expect(getByText('Favorites')).toBeTruthy();

    // Palavras no grid
    expect(getByText('hello')).toBeTruthy();
    expect(getByText('today')).toBeTruthy();
    expect(getByText('great')).toBeTruthy();
  });

  it('deve alternar para a aba Favorites e exibir palavras favoritadas', async () => {
    const { getByText } = renderWithProviders(<HomeScreen />);

    await act(async () => {
      fireEvent.press(getByText('Favorites'));
    });

    await waitFor(() => {
      expect(useWordStore.getState().activeTab).toBe('favorites');
      expect(getByText('hello')).toBeTruthy();
    });
  });

  it('deve alternar para a aba History e exibir mensagem de histórico vazio quando não houver itens', async () => {
    const { getByText } = renderWithProviders(<HomeScreen />);

    await act(async () => {
      fireEvent.press(getByText('History'));
    });

    await waitFor(() => {
      expect(useWordStore.getState().activeTab).toBe('history');
      expect(getByText(/Seu histórico está vazio/i)).toBeTruthy();
    });
  });

  it('deve abrir o modal de detalhes ao tocar em uma palavra do grid', async () => {
    const { getByText, findByText } = renderWithProviders(<HomeScreen />);

    await act(async () => {
      fireEvent.press(getByText('today'));
    });

    expect(useWordStore.getState().selectedWord).toBe('today');
    expect(await findByText(/This present day/)).toBeTruthy();
  });
});
