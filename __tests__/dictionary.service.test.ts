import { DictionaryApiService } from '../src/modules/dictionary/infrastructure/dictionary-api.service';

describe('DictionaryApiService Unit Tests', () => {
  let service: DictionaryApiService;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    service = new DictionaryApiService();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('deve formatar e retornar os detalhes da palavra corretamente a partir da API', async () => {
    const mockApiResponse = [
      {
        word: 'hello',
        phonetic: 'həˈləʊ',
        phonetics: [
          { text: 'həˈləʊ', audio: 'https://api.dictionaryapi.dev/media/hello.mp3' }
        ],
        meanings: [
          {
            partOfSpeech: 'noun',
            definitions: [
              {
                definition: 'An utterance of hello; a greeting.',
                example: 'she was greeted with hello'
              }
            ]
          },
          {
            partOfSpeech: 'verb',
            definitions: [
              {
                definition: '"Hello!" or an equivalent greeting.',
                example: 'I helloed to them'
              }
            ]
          }
        ]
      }
    ];

    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockApiResponse),
    } as any);

    const result = await service.fetchWordDetail('hello');

    expect(result).not.toBeNull();
    expect(result?.word).toBe('hello');
    expect(result?.phonetic).toBe('həˈləʊ');
    expect(result?.phonetics[0].audio).toBe('https://api.dictionaryapi.dev/media/hello.mp3');
    expect(result?.meanings.length).toBe(2);
    expect(result?.meanings[1].partOfSpeech).toBe('verb');
    expect(result?.meanings[1].definitions[0].definition).toBe('"Hello!" or an equivalent greeting.');
  });

  it('deve retornar null se a palavra não for encontrada (status 404)', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: jest.fn().mockResolvedValue({ title: 'No Definitions Found' }),
    } as any);

    const result = await service.fetchWordDetail('nonexistentwordxyz');
    expect(result).toBeNull();
  });

  it('deve retornar null para termos vazios ou apenas espaços', async () => {
    const result = await service.fetchWordDetail('   ');
    expect(result).toBeNull();
  });
});
