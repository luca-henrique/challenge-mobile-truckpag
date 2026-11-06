import { ExpoAudioPlayerService } from '../src/modules/audio/infrastructure/expo-audio-player.service';
import * as Speech from 'expo-speech';

describe('ExpoAudioPlayerService Unit Tests', () => {
  let player: ExpoAudioPlayerService;

  beforeEach(() => {
    player = new ExpoAudioPlayerService();
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await player.stop();
  });

  it('deve tocar áudio a partir da URL com expo-audio', async () => {
    const onProgress = jest.fn();
    const ExpoAudio = require('expo-audio');

    await player.playWord('hello', 'https://api.dictionaryapi.dev/media/hello.mp3', onProgress);

    expect(ExpoAudio.createAudioPlayer).toHaveBeenCalledWith(
      'https://api.dictionaryapi.dev/media/hello.mp3'
    );
  });

  it('deve normalizar URLs sem protocolo iniciando com //', async () => {
    const ExpoAudio = require('expo-audio');

    await player.playWord('hello', '//api.dictionaryapi.dev/media/hello.mp3');

    expect(ExpoAudio.createAudioPlayer).toHaveBeenCalledWith(
      'https://api.dictionaryapi.dev/media/hello.mp3'
    );
  });

  it('deve usar o Speech TTS como fallback quando não houver URL de áudio', async () => {
    await player.playWord('hello', undefined);

    expect(Speech.speak).toHaveBeenCalledWith(
      'hello',
      expect.objectContaining({ language: 'en-US' })
    );
  });

  it('deve parar qualquer reprodução em andamento ao chamar stop()', async () => {
    await player.stop();
    expect(Speech.stop).toHaveBeenCalled();
  });
});
