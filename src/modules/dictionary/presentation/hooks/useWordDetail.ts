import { useQuery } from '@tanstack/react-query';
import { container } from '../../../../core/di/container';
import { WordDetail } from '../../domain/entities/dictionary-word';

export function useWordDetail(word: string | null) {
  const cleanWord = word ? word.trim().toLowerCase() : '';

  return useQuery<WordDetail | null>({
    queryKey: ['wordDetail', cleanWord],
    queryFn: async () => {
      if (!cleanWord) return null;
      return container.dictionaryService.fetchWordDetail(cleanWord);
    },
    enabled: !!cleanWord,
  });
}

