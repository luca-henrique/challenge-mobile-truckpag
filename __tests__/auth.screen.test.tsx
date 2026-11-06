import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AuthScreen } from '../src/modules/auth/presentation/screens/AuthScreen';
import { useAuthStore } from '../src/modules/auth/presentation/state/useAuthStore';

describe('AuthScreen Component Tests', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      isLoading: false,
      error: null,
      isGuest: false,
    });
    jest.clearAllMocks();
  });

  it('deve renderizar a tela de login por padrão com título e campos', () => {
    const { getByText, getByTestId } = render(<AuthScreen />);

    expect(getByText('Free Dictionary')).toBeTruthy();
    expect(getByTestId('email-input')).toBeTruthy();
    expect(getByTestId('password-input')).toBeTruthy();
    expect(getByText('Acessar Conta')).toBeTruthy();
  });

  it('deve alternar para o modo de cadastro e exibir o campo Nome', () => {
    const { getByTestId, queryByTestId, getByText } = render(<AuthScreen />);

    // No modo login, campo nome não existe
    expect(queryByTestId('name-input')).toBeNull();

    // Toca na aba de cadastro
    fireEvent.press(getByTestId('tab-register'));

    // Agora o campo nome deve aparecer e o botão principal muda
    expect(getByTestId('name-input')).toBeTruthy();
    expect(getByText('Criar Minha Conta')).toBeTruthy();
  });

  it('deve exibir mensagem de erro ao tentar submeter com campos vazios', async () => {
    const { getByTestId, getByText } = render(<AuthScreen />);

    fireEvent.press(getByTestId('submit-button'));

    await waitFor(() => {
      expect(getByText('Preencha todos os campos obrigatórios.')).toBeTruthy();
    });
  });

  it('deve permitir continuar como visitante ao pressionar o botão', () => {
    const { getByTestId } = render(<AuthScreen />);

    fireEvent.press(getByTestId('guest-button'));

    const state = useAuthStore.getState();
    expect(state.user).not.toBeNull();
    expect(state.isGuest).toBe(true);
  });
});
