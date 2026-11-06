import { IAuthRepository } from '../../modules/auth/domain/repositories/auth.repository.interface';
import { LocalAuthRepository } from '../../modules/auth/infrastructure/local-auth.repository';
import { IFavoriteRepository } from '../../modules/dictionary/domain/repositories/favorite.repository.interface';
import { SQLiteFavoriteRepository } from '../../modules/dictionary/infrastructure/sqlite-favorite.repository';
import { IHistoryRepository } from '../../modules/dictionary/domain/repositories/history.repository.interface';
import { SQLiteHistoryRepository } from '../../modules/dictionary/infrastructure/sqlite-history.repository';
import { IWordRepository } from '../../modules/dictionary/domain/repositories/word.repository.interface';
import { SQLiteWordRepository } from '../../modules/dictionary/infrastructure/sqlite-word.repository';
import { IDictionaryService } from '../../modules/dictionary/domain/services/dictionary.service.interface';
import { DictionaryApiService } from '../../modules/dictionary/infrastructure/dictionary-api.service';
import { IAudioPlayerService } from '../../modules/audio/domain/audio-player.interface';
import { ExpoAudioPlayerService } from '../../modules/audio/infrastructure/expo-audio-player.service';

export class DependencyContainer {
  private static instance: DependencyContainer;

  private _authRepository: IAuthRepository | null = null;
  private _favoriteRepository: IFavoriteRepository | null = null;
  private _historyRepository: IHistoryRepository | null = null;
  private _wordRepository: IWordRepository | null = null;
  private _dictionaryService: IDictionaryService | null = null;
  private _audioPlayerService: IAudioPlayerService | null = null;

  private constructor() {}

  public static getInstance(): DependencyContainer {
    if (!DependencyContainer.instance) {
      DependencyContainer.instance = new DependencyContainer();
    }
    return DependencyContainer.instance;
  }

  public get authRepository(): IAuthRepository {
    if (!this._authRepository) {
      this._authRepository = new LocalAuthRepository();
    }
    return this._authRepository;
  }

  public setAuthRepository(repo: IAuthRepository): void {
    this._authRepository = repo;
  }

  public get favoriteRepository(): IFavoriteRepository {
    if (!this._favoriteRepository) {
      this._favoriteRepository = new SQLiteFavoriteRepository();
    }
    return this._favoriteRepository;
  }

  public setFavoriteRepository(repo: IFavoriteRepository): void {
    this._favoriteRepository = repo;
  }

  public get historyRepository(): IHistoryRepository {
    if (!this._historyRepository) {
      this._historyRepository = new SQLiteHistoryRepository();
    }
    return this._historyRepository;
  }

  public setHistoryRepository(repo: IHistoryRepository): void {
    this._historyRepository = repo;
  }

  public get wordRepository(): IWordRepository {
    if (!this._wordRepository) {
      this._wordRepository = new SQLiteWordRepository();
    }
    return this._wordRepository;
  }

  public setWordRepository(repo: IWordRepository): void {
    this._wordRepository = repo;
  }

  public get dictionaryService(): IDictionaryService {
    if (!this._dictionaryService) {
      this._dictionaryService = new DictionaryApiService();
    }
    return this._dictionaryService;
  }

  public setDictionaryService(service: IDictionaryService): void {
    this._dictionaryService = service;
  }

  public get audioPlayerService(): IAudioPlayerService {
    if (!this._audioPlayerService) {
      this._audioPlayerService = new ExpoAudioPlayerService();
    }
    return this._audioPlayerService;
  }

  public setAudioPlayerService(service: IAudioPlayerService): void {
    this._audioPlayerService = service;
  }

  public reset(): void {
    this._authRepository = null;
    this._favoriteRepository = null;
    this._historyRepository = null;
    this._wordRepository = null;
    this._dictionaryService = null;
    this._audioPlayerService = null;
  }
}

export const container = DependencyContainer.getInstance();
