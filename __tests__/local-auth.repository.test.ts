import { LocalAuthRepository } from '../src/modules/auth/infrastructure/local-auth.repository';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { getDatabase } from '../src/core/storage/database';

jest.mock('../src/core/storage/database', () => ({
  getDatabase: jest.fn(),
  importPrepopulatedDatabase: jest.fn().mockResolvedValue(undefined),
}));

describe('SqliteAuthRepository (LocalAuthRepository) Unit Tests', () => {
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

  it('deve cadastrar um novo usuário com salt único e senha hasheada', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce(null); // Nenhum usuário existente
    mockDb.runAsync.mockResolvedValueOnce({ changes: 1 });

    const user = await repository.signUp('user@truckpag.com', 'secret123', 'Lucas Dev');

    expect(user.id).toBeDefined();
    expect(user.email).toBe('user@truckpag.com');
    expect(user.name).toBe('Lucas Dev');

    // Verifica se salvou com salt e hash na tabela users
    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO users'),
      expect.arrayContaining(['user@truckpag.com', 'Lucas Dev'])
    );

    // Verifica persistência no SecureStore
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('truckpag_auth_user_id', user.id);
  });

  it('deve gerar salts distintos e hashes diferentes mesmo para senhas idênticas', async () => {
    mockDb.getFirstAsync.mockResolvedValue(null);
    mockDb.runAsync.mockResolvedValue({ changes: 1 });

    const user1 = await repository.signUp('user1@truckpag.com', 'samepassword123');
    const user2 = await repository.signUp('user2@truckpag.com', 'samepassword123');

    expect(user1.id).not.toBe(user2.id);

    // Chamadas de inserção no banco
    const firstCallArgs = mockDb.runAsync.mock.calls[0][1];
    const secondCallArgs = mockDb.runAsync.mock.calls[1][1];

    const hash1 = firstCallArgs[3];
    const salt1 = firstCallArgs[4];
    const hash2 = secondCallArgs[3];
    const salt2 = secondCallArgs[4];

    expect(salt1).not.toBe(salt2);
    expect(hash1).not.toBe(hash2);
  });

  it('deve lançar erro ao cadastrar usuário com email já existente', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce({ id: 'existing-id' });

    await expect(
      repository.signUp('already@exists.com', 'secret123')
    ).rejects.toThrow('Este email já está cadastrado.');
  });

  it('deve realizar login quando email e hash coincidem com o salt', async () => {
    const salt = 'unique-salt-123';
    const password = 'mySecretPassword';
    const expectedHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      `${salt}:${password}`
    );

    mockDb.getFirstAsync.mockResolvedValueOnce({
      id: 'user-uuid-1',
      name: 'Lucas Dev',
      email: 'user@truckpag.com',
      password_hash: expectedHash,
      salt: salt,
      created_at: '2026-11-06T00:00:00.000Z',
    });

    const user = await repository.signIn('user@truckpag.com', password);

    expect(user.id).toBe('user-uuid-1');
    expect(user.email).toBe('user@truckpag.com');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('truckpag_auth_user_id', 'user-uuid-1');
  });

  it('deve lançar erro quando a senha de login estiver incorreta', async () => {
    const salt = 'unique-salt-123';
    mockDb.getFirstAsync.mockResolvedValueOnce({
      id: 'user-uuid-1',
      name: 'Lucas Dev',
      email: 'user@truckpag.com',
      password_hash: 'different_hash_value',
      salt: salt,
      created_at: '2026-11-06T00:00:00.000Z',
    });

    await expect(
      repository.signIn('user@truckpag.com', 'wrong_password')
    ).rejects.toThrow('Senha incorreta.');
  });
});
