jest.mock('expo-crypto', () => ({
  digestStringAsync: jest.fn().mockResolvedValue('mocked_hash'),
  randomUUID: jest.fn().mockReturnValue('mocked_uuid'),
  CryptoDigestAlgorithm: { SHA256: 'SHA-256' },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn().mockResolvedValue(undefined),
  getItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(undefined),
  clear: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn().mockResolvedValue({
    execAsync: jest.fn(),
    runAsync: jest.fn(),
    getFirstAsync: jest.fn(),
    getAllAsync: jest.fn(),
    withTransactionAsync: jest.fn((cb) => cb()),
  }),
}));

jest.mock('expo-audio', () => ({
  createAudioPlayer: jest.fn().mockReturnValue({
    play: jest.fn(),
    pause: jest.fn(),
    remove: jest.fn(),
    currentTime: 0,
    duration: 1,
    playing: false,
    addListener: jest.fn(),
  }),
}));

jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  stop: jest.fn(),
}));
