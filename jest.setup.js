jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('expo-crypto', () => ({
  digestStringAsync: jest.fn().mockImplementation((_algo, str) => {
    return Promise.resolve(`hash_of_${str}`);
  }),
  randomUUID: jest.fn().mockImplementation(() => {
    return `uuid-${Math.random().toString(36).substring(2, 9)}`;
  }),
  CryptoDigestAlgorithm: { SHA256: 'SHA-256' },
}));

jest.mock('expo-secure-store', () => {
  let store = {};
  return {
    setItemAsync: jest.fn((key, value) => {
      store[key] = value;
      return Promise.resolve();
    }),
    getItemAsync: jest.fn((key) => Promise.resolve(store[key] || null)),
    deleteItemAsync: jest.fn((key) => {
      delete store[key];
      return Promise.resolve();
    }),
    __clearStore: () => {
      store = {};
    },
  };
});

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn().mockResolvedValue(undefined),
  getItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(undefined),
  clear: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn().mockResolvedValue({
    execAsync: jest.fn().mockResolvedValue(undefined),
    runAsync: jest.fn().mockResolvedValue({ changes: 1 }),
    getFirstAsync: jest.fn().mockResolvedValue(null),
    getAllAsync: jest.fn().mockResolvedValue([]),
    withTransactionAsync: jest.fn((cb) => cb()),
  }),
  importDatabaseFromAssetAsync: jest.fn().mockResolvedValue(undefined),
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
