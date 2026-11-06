import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from '../src/navigation/root-navigator';
import { useAuthStore } from '../src/modules/auth/presentation/state/useAuthStore';
import { useWordStore } from '../src/modules/dictionary/presentation/state/useWordStore';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { container } from '../src/core/di/container';

describe('Navigation & Route Guards Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });

    container.setFavoriteRepository({
      getFavorites: jest.fn().mockResolvedValue([]),
      addFavorite: jest.fn().mockResolvedValue(undefined),
      removeFavorite: jest.fn().mockResolvedValue(undefined),
      isFavorite: jest.fn().mockResolvedValue(false),
    });

    container.setHistoryRepository({
      getHistory: jest.fn().mockResolvedValue([]),
      addToHistory: jest.fn().mockResolvedValue(undefined),
      clearHistory: jest.fn().mockResolvedValue(undefined),
    });

    container.setWordRepository({
      getWords: jest.fn().mockResolvedValue(['hello']),
      populateInitialWords: jest.fn().mockResolvedValue(1),
      countWords: jest.fn().mockResolvedValue(1),
    });

    useWordStore.setState({
      activeTab: 'words',
      words: ['hello'],
      history: [],
      favorites: [],
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
        <NavigationContainer>{component}</NavigationContainer>
      </QueryClientProvider>
    );
  };

  it('deve exibir a tela de loading enquanto a sessão está sendo verificada', () => {
    useAuthStore.setState({
      isLoading: true,
      user: null,
      isGuest: false,
      initSession: jest.fn().mockResolvedValue(undefined),
    });

    const { getByText } = renderWithProviders(<RootNavigator />);
    expect(getByText('Carregando dicionário...')).toBeTruthy();
  });

  it('deve exibir a rota pública de autenticação quando não autenticado', async () => {
    useAuthStore.setState({
      isLoading: false,
      user: null,
      isGuest: false,
      initSession: jest.fn().mockResolvedValue(undefined),
    });

    const { getByText, getByTestId } = renderWithProviders(<RootNavigator />);

    await waitFor(() => {
      expect(getByText('Free Dictionary')).toBeTruthy();
      expect(getByTestId('email-input')).toBeTruthy();
      expect(getByText('Acessar Conta')).toBeTruthy();
    });
  });

  it('deve exibir a rota privada HomeScreen quando autenticado como usuário', async () => {
    useAuthStore.setState({
      isLoading: false,
      user: {
        id: 'user-1',
        name: 'Lucas Nav Tester',
        email: 'lucas@test.com',
        createdAt: '2026-11-06T00:00:00Z',
      },
      isGuest: false,
      initSession: jest.fn().mockResolvedValue(undefined),
    });

    const { getByText, getAllByText } = renderWithProviders(<RootNavigator />);

    await waitFor(() => {
      expect(getByText('Lucas Nav Tester')).toBeTruthy();
      expect(getAllByText('Word list').length).toBeGreaterThanOrEqual(1);
      expect(getByText('Favorites')).toBeTruthy();
    });
  });

  it('deve exibir a rota privada HomeScreen quando em modo visitante', async () => {
    useAuthStore.setState({
      isLoading: false,
      user: null,
      isGuest: true,
      initSession: jest.fn().mockResolvedValue(undefined),
    });

    const { getByText, getAllByText } = renderWithProviders(<RootNavigator />);

    await waitFor(() => {
      expect(getByText('Entrar / Visitante')).toBeTruthy();
      expect(getAllByText('Word list').length).toBeGreaterThanOrEqual(1);
    });
  });
});
