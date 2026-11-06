import * as Speech from 'expo-speech';
import { IAudioPlayerService, AudioProgressCallback } from '../domain/audio-player.interface';

export class ExpoAudioPlayerService implements IAudioPlayerService {
  private currentPlayer: any = null;
  private isCurrentlyPlaying = false;
  private progressInterval: ReturnType<typeof setInterval> | null = null;

  async playWord(
    word: string,
    audioUrl?: string,
    onProgress?: AudioProgressCallback
  ): Promise<void> {
    await this.stop();

    if (audioUrl && audioUrl.trim().length > 0) {
      try {
        const fullUrl = audioUrl.startsWith('//') ? `https:${audioUrl}` : audioUrl;

        // Tenta carregar expo-audio dinamicamente de forma segura
        const ExpoAudio = require('expo-audio');
        if (ExpoAudio && typeof ExpoAudio.createAudioPlayer === 'function') {
          const player = ExpoAudio.createAudioPlayer(fullUrl);
          this.currentPlayer = player;
          this.isCurrentlyPlaying = true;

          player.play();

          // Monitora o progresso de reprodução
          this.progressInterval = setInterval(() => {
            const current = player.currentTime || 0;
            const total = player.duration || 1;
            const progress = Math.min(1, Math.max(0, current / total));

            if (onProgress) {
              onProgress({
                isPlaying: player.playing,
                positionMillis: Math.round(current * 1000),
                durationMillis: Math.round(total * 1000),
                progress,
              });
            }

            if (!player.playing && progress >= 0.95) {
              this.stop();
            }
          }, 100);

          return;
        }
      } catch (err) {
        console.warn('expo-audio não disponível ou falhou ao carregar URL, usando TTS fallback:', err);
      }
    }

    // Fallback nativo via Text-to-Speech (TTS)
    await this.fallbackSpeech(word, onProgress);
  }

  private async fallbackSpeech(
    word: string,
    onProgress?: AudioProgressCallback
  ): Promise<void> {
    this.isCurrentlyPlaying = true;
    const estimatedDurationMs = Math.max(800, word.length * 150);
    const startTime = Date.now();

    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }

    this.progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / estimatedDurationMs);

      if (onProgress) {
        onProgress({
          isPlaying: progress < 1,
          positionMillis: elapsed,
          durationMillis: estimatedDurationMs,
          progress,
        });
      }

      if (progress >= 1) {
        if (this.progressInterval) {
          clearInterval(this.progressInterval);
          this.progressInterval = null;
        }
        this.isCurrentlyPlaying = false;
      }
    }, 50);

    try {
      Speech.speak(word, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.9,
        onDone: () => {
          if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
          }
          this.isCurrentlyPlaying = false;
          if (onProgress) {
            onProgress({
              isPlaying: false,
              positionMillis: estimatedDurationMs,
              durationMillis: estimatedDurationMs,
              progress: 1,
            });
          }
        },
        onError: () => {
          if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
          }
          this.isCurrentlyPlaying = false;
        },
      });
    } catch (err) {
      console.warn('Speech.speak falhou:', err);
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
        this.progressInterval = null;
      }
      this.isCurrentlyPlaying = false;
    }
  }

  async stop(): Promise<void> {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }

    if (this.currentPlayer) {
      try {
        if (typeof this.currentPlayer.pause === 'function') {
          this.currentPlayer.pause();
        }
        if (typeof this.currentPlayer.remove === 'function') {
          this.currentPlayer.remove();
        }
      } catch {
        // Ignora
      }
      this.currentPlayer = null;
    }

    try {
      Speech.stop();
    } catch {
      // Ignora erro de speech stop
    }

    this.isCurrentlyPlaying = false;
  }

  isPlaying(): boolean {
    return this.isCurrentlyPlaying;
  }
}
