import React, { useEffect } from 'react';
import { Modal, View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWordDetail } from '../../../modules/dictionary/presentation/hooks/useWordDetail';
import { useWordStore } from '../../../modules/dictionary/presentation/state/useWordStore';
import { useAuthStore } from '../../../modules/auth/presentation/state/useAuthStore';
import { tokens } from '../../../shared/theme/tokens';
import { useWordAudio } from '../model/use-word-audio';
import { WordDetailTopBar } from './word-detail-top-bar';
import { WordHeaderCard } from './word-header-card';
import { AudioPlayerControl } from './audio-player-control';
import { MeaningsSection } from './meanings-section';
import { ModalNavigationBar } from './modal-navigation-bar';

export interface WordDetailModalProps {
  visible: boolean;
  onClose: () => void;
}

export const WordDetailModal: React.FC<WordDetailModalProps> = ({ visible, onClose }) => {
  const { selectedWord, selectNextWord, selectPreviousWord, isWordFavorite, toggleFavorite, recordWordView } =
    useWordStore();
  const { user } = useAuthStore();
  const activeUserId = user ? user.id : 'guest_user';

  const { data: wordDetail, isLoading, isError } = useWordDetail(selectedWord);
  const audioUrl = wordDetail?.phonetics?.find((p) => p.audio && p.audio.trim().length > 0)?.audio;
  const { isPlaying, progress, togglePlay } = useWordAudio(selectedWord, audioUrl);

  const isFav = selectedWord ? isWordFavorite(selectedWord) : false;

  useEffect(() => {
    if (visible && selectedWord) {
      recordWordView(activeUserId, selectedWord);
    }
  }, [visible, selectedWord, activeUserId]);

  if (!selectedWord) return null;

  const phoneticDisplay = wordDetail?.phonetic || wordDetail?.phonetics?.find((p) => p.text)?.text || '';

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <WordDetailTopBar
            isFavorite={isFav}
            onClose={onClose}
            onToggleFavorite={() => toggleFavorite(activeUserId, selectedWord)}
          />

          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
            <WordHeaderCard word={selectedWord} phonetic={phoneticDisplay} />
            <AudioPlayerControl isPlaying={isPlaying} progress={progress} onTogglePlay={togglePlay} />
            <MeaningsSection isLoading={isLoading} isError={isError} meanings={wordDetail?.meanings} />
          </ScrollView>

          <ModalNavigationBar onPrevious={selectPreviousWord} onNext={selectNextWord} />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
  },
  container: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: tokens.spacing.xl,
  },
});

