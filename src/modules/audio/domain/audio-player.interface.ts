export type AudioProgressCallback = (status: {
  isPlaying: boolean;
  positionMillis: number;
  durationMillis: number;
  progress: number; // 0.0 to 1.0
}) => void;

export interface IAudioPlayerService {
  playWord(
    word: string,
    audioUrl?: string,
    onProgress?: AudioProgressCallback
  ): Promise<void>;
  stop(): Promise<void>;
  isPlaying(): boolean;
}

