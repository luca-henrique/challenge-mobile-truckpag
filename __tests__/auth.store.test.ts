import { useAuthStore } from '../src/modules/auth/presentation/state/useAuthStore';
import { container } from '../src/core/di/container';
import { IAuthRepository } from '../src/modules/auth/domain/repositories/auth.repository.interface';
import { User } from '../src/modules/auth/domain/entities/user';

describe('Auth Store (useAuthStore) with Dependency Injection', () => {
  let mockUser: User;
  let mockAuthRepository: jest.Mocked<IAuthRepository>;

  beforeEach(() => {
    mockUser = {
      id: 'user-123',
      email: 'test@truckpag.com',
      name: 'TruckPag Tester',
      createdAt: '2026-11-05T00:00:00.000Z',
    };

    mockAuthRepository = {
      signIn: jest.fn().mockResolvedValue(mockUser),
      signUp: jest.fn().mockResolvedValue(mockUser),
      signOut: jest.fn().mockResolvedValue(undefined),
      getCurrentUser: jest.fn().mockResolvedValue(null),
    };

    // Injeta o mock no DI container (Diferencial 2)
    container.setAuthRepository(mockAuthRepository);

    // Reseta store
    useAuthStore.setState({
      user: null,
      isLoading: false,
      error: null,
      isGuest: false,
    });
  });

  afterEach(() => {
    container.reset();
  });

  it('deve realizar login com sucesso e atualizar o estado do usuário', async () => {
    await useAuthStore.getState().signIn('test@truckpag.com', '123456');

    expect(mockAuthRepository.signIn).toHaveBeenCalledWith('test@truckpag.com', '123456');
    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().isGuest).toBe(false);
    expect(useAuthStore.getState().error).toBeNull();
  });

  it('deve lidar com erro de login e atualizar a mensagem de erro', async () => {
    mockAuthRepository.signIn.mockRejectedValueOnce(new Error('Credenciais inválidas'));

    await expect(
      useAuthStore.getState().signIn('wrong@truckpag.com', '000000')
    ).rejects.toThrow('Credenciais inválidas');

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().error).toBe('Credenciais inválidas');
  });

  it('deve realizar cadastro com sucesso e atualizar estado', async () => {
    await useAuthStore.getState().signUp('test@truckpag.com', '123456', 'TruckPag Tester');

    expect(mockAuthRepository.signUp).toHaveBeenCalledWith('test@truckpag.com', '123456', 'TruckPag Tester');
    expect(useAuthStore.getState().user).toEqual(mockUser);
  });

  it('deve permitir continuar como visitante (Guest mode)', () => {
    useAuthStore.getState().continueAsGuest();

    const state = useAuthStore.getState();
    expect(state.user).not.toBeNull();
    expect(state.user?.id).toBe('guest_user');
    expect(state.isGuest).toBe(true);
  });

  it('deve realizar logout com sucesso e limpar o usuário', async () => {
    useAuthStore.setState({ user: mockUser });

    await useAuthStore.getState().signOut();

    expect(mockAuthRepository.signOut).toHaveBeenCalled();
    expect(useAuthStore.getState().user).toBeNull();
  });
});

