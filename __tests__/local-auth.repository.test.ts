import { LocalAuthRepository } from '../src/modules/auth/infrastructure/local-auth.repository';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from '../src/core/storage/database';

jest.mock('../src/core/storage/database', () => ({
  getDatabase: jest.fn(),
}));

describe('LocalAuthRepository Unit Tests', () => {
  let repository: LocalAuthRepository;
  let mockDb: any;

  beforeEach(() => {
    repository = new LocalAuthRepository();
    mockDb = {
      getFirstAsync: jest.fn(),
      runAsync: jest.fn(),
      execAsync: jest.fn(),
    };
    (getDatabase as jest.Mock).mockResolvedValue(mockDb);
    jest.clearAllMocks();
  });

  it('deve cadastrar um novo usuário com senha hasheada com sucesso', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce(null); // Nenhum usuário com mesmo email
    mockDb.runAsync.mockResolvedValueOnce({ changes: 1 });
    (Crypto.digestStringAsync as jest.Mock).mockResolvedValueOnce('hashed_secret_password');
    (Crypto.randomUUID as jest.Mock).mockReturnValueOnce('user-uuid-1');

    const user = await repository.signUp('user@truckpag.com', 'secret123', 'Lucas Dev');

    expect(user.id).toBe('user-uuid-1');
    expect(user.email).toBe('user@truckpag.com');
    expect(user.name).toBe('Lucas Dev');
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO users'),
      expect.arrayContaining(['user-uuid-1', 'user@truckpag.com', 'hashed_secret_password', 'Lucas Dev'])
    );
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@truckpag:auth_user_id', 'user-uuid-1');
  });

  it('deve lançar erro ao cadastrar usuário com email já existente', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce({ id: 'existing-id' });

    await expect(
      repository.signUp('already@exists.com', 'secret123')
    ).rejects.toThrow('Este email já está cadastrado.');
  });

  it('deve realizar login quando email e hash coincidem', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce({
      id: 'user-uuid-1',
      email: 'user@truckpag.com',
      password_hash: 'hashed_secret_password',
      name: 'Lucas Dev',
      created_at: '2026-11-05T00:00:00.000Z',
    });
    (Crypto.digestStringAsync as jest.Mock).mockResolvedValueOnce('hashed_secret_password');

    const user = await repository.signIn('user@truckpag.com', 'secret123');

    expect(user.id).toBe('user-uuid-1');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@truckpag:auth_user_id', 'user-uuid-1');
  });

  it('deve lançar erro quando a senha de login estiver incorreta', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce({
      id: 'user-uuid-1',
      email: 'user@truckpag.com',
      password_hash: 'hashed_secret_password',
      name: 'Lucas Dev',
      created_at: '2026-11-05T00:00:00.000Z',
    });
    (Crypto.digestStringAsync as jest.Mock).mockResolvedValueOnce('wrong_hash');

    await expect(
      repository.signIn('user@truckpag.com', 'wrong_password')
    ).rejects.toThrow('Senha incorreta.');
  });
});

