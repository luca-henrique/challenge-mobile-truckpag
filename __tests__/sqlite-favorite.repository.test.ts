import { SQLiteFavoriteRepository } from '../src/modules/dictionary/infrastructure/sqlite-favorite.repository';
import { getDatabase } from '../src/core/storage/database';

jest.mock('../src/core/storage/database', () => ({
  getDatabase: jest.fn(),
}));

describe('SQLiteFavoriteRepository Unit Tests', () => {
  let repository: SQLiteFavoriteRepository;
  let mockDb: any;

  beforeEach(() => {
    repository = new SQLiteFavoriteRepository();
    mockDb = {
      runAsync: jest.fn(),
      getFirstAsync: jest.fn(),
      getAllAsync: jest.fn(),
    };
    (getDatabase as jest.Mock).mockResolvedValue(mockDb);
    jest.clearAllMocks();
  });

  it('deve adicionar favorito vinculado ao userId', async () => {
    await repository.addFavorite('user-1', 'hello');

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('INSERT OR IGNORE INTO favorites'),
      expect.arrayContaining(['user-1', 'hello'])
    );
  });

  it('deve remover favorito do usuário', async () => {
    await repository.removeFavorite('user-1', 'hello');

    expect(mockDb.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('DELETE FROM favorites'),
      ['user-1', 'hello']
    );
  });

  it('deve verificar se a palavra é favorita', async () => {
    mockDb.getFirstAsync.mockResolvedValueOnce({ id: 'fav-1' });

    const isFav = await repository.isFavorite('user-1', 'hello');
    expect(isFav).toBe(true);
    expect(mockDb.getFirstAsync).toHaveBeenCalledWith(
      expect.stringContaining('SELECT id FROM favorites'),
      ['user-1', 'hello']
    );
  });

  it('deve listar palavras favoritas ordenadas', async () => {
    mockDb.getAllAsync.mockResolvedValueOnce([{ word: 'hello' }, { word: 'world' }]);

    const favorites = await repository.getFavorites('user-1', 10, 0);
    expect(favorites).toEqual(['hello', 'world']);
  });
});

