import { useState, useEffect, useCallback } from 'react';
import { container } from '../../../core/di/container';

export function useWordAudio(selectedWord: string | null, audioUrl?: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Para o áudio quando a palavra selecionada mudar ou unmount
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    container.audioPlayerService.stop().catch(console.warn);

    return () => {
      container.audioPlayerService.stop().catch(console.warn);
    };
  }, [selectedWord]);

  const togglePlay = useCallback(async () => {
    if (!selectedWord) return;

    if (isPlaying) {
      await container.audioPlayerService.stop();
      setIsPlaying(false);
      setProgress(0);
      return;
    }

    setIsPlaying(true);
    setProgress(0);

    try {
      await container.audioPlayerService.playWord(selectedWord, audioUrl, (status) => {
        setIsPlaying(status.isPlaying);
        setProgress(status.progress);
        if (!status.isPlaying && status.progress >= 0.98) {
          setTimeout(() => setProgress(0), 400);
        }
      });
    } catch {
      setIsPlaying(false);
    }
  }, [selectedWord, audioUrl, isPlaying]);

  return {
    isPlaying,
    progress,
    togglePlay,
  };
}
