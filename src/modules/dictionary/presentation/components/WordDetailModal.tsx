import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWordDetail } from '../hooks/useWordDetail';
import { useWordStore } from '../state/useWordStore';
import { useAuthStore } from '../../../auth/presentation/state/useAuthStore';
import { container } from '../../../../core/di/container';
import { Ionicons } from '@expo/vector-icons';

interface WordDetailModalProps {
  visible: boolean;
  onClose: () => void;
}

export const WordDetailModal: React.FC<WordDetailModalProps> = ({ visible, onClose }) => {
  const { selectedWord, selectNextWord, selectPreviousWord, isWordFavorite, toggleFavorite, recordWordView } =
    useWordStore();
  const { user } = useAuthStore();

  const { data: wordDetail, isLoading, isError, error } = useWordDetail(selectedWord);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const activeUserId = user ? user.id : 'guest_user';
  const isFav = selectedWord ? isWordFavorite(selectedWord) : false;

  // Ao abrir a palavra, registra visualização no histórico
  useEffect(() => {
    if (visible && selectedWord) {
      recordWordView(activeUserId, selectedWord);
    }
  }, [visible, selectedWord, activeUserId]);

  // Ao trocar de palavra ou fechar, para qualquer áudio
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    container.audioPlayerService.stop().catch(console.warn);

    return () => {
      container.audioPlayerService.stop().catch(console.warn);
    };
  }, [selectedWord, visible]);

  if (!selectedWord) return null;

  const handlePlayAudio = async () => {
    if (isPlaying) {
      await container.audioPlayerService.stop();
      setIsPlaying(false);
      setProgress(0);
      return;
    }

    setIsPlaying(true);
    setProgress(0);

    // Encontra o primeiro áudio disponível nas fonéticas
    const audioUrl = wordDetail?.phonetics?.find((p) => p.audio && p.audio.trim().length > 0)?.audio;

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
  };

  const handleToggleFavorite = async () => {
    if (selectedWord) {
      await toggleFavorite(activeUserId, selectedWord);
    }
  };

  // Transcrição fonética a exibir
  const phoneticDisplay = wordDetail?.phonetic ||
    wordDetail?.phonetics?.find((p) => p.text)?.text ||
    '';

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Top Bar: Close "X" and Favorite Heart */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Text style={styles.closeText}>X</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleToggleFavorite} style={styles.favButton}>
              <Ionicons
                name={isFav ? 'heart' : 'heart-outline'}
                size={26}
                color={isFav ? '#e11d48' : '#4b5563'}
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
            {/* Word Card (Wireframe: large light box with border) */}
            <View style={styles.wordCard}>
              <Text style={styles.wordTitle}>{selectedWord}</Text>
              {phoneticDisplay ? (
                <Text style={styles.phoneticText}>{phoneticDisplay}</Text>
              ) : (
                <Text style={styles.phoneticTextPlaceholder}>/ - /</Text>
              )}
            </View>

            {/* Audio Player (Wireframe: Triangle play button + Blue Progress Bar) */}
            <View style={styles.audioPlayerContainer}>
              <TouchableOpacity
                onPress={handlePlayAudio}
                style={styles.playButton}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={32}
                  color="#111827"
                  style={isPlaying ? {} : { marginLeft: 3 }}
                />
              </TouchableOpacity>

              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${Math.round(progress * 100)}%` },
                  ]}
                />
              </View>
            </View>

            {/* Meanings Section Header */}
            <Text style={styles.meaningsHeader}>Meanings</Text>

            {/* Content / Loading / Error handling */}
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4b5563" />
                <Text style={styles.loadingText}>Carregando significados...</Text>
              </View>
            ) : isError ? (
              <View style={styles.messageBox}>
                <Text style={styles.errorMessage}>
                  Não foi possível carregar as definições. Verifique a conexão.
                </Text>
              </View>
            ) : !wordDetail || wordDetail.meanings.length === 0 ? (
              <View style={styles.messageBox}>
                <Text style={styles.notFoundText}>
                  Definições não encontradas na Free Dictionary API para esta palavra.
                </Text>
              </View>
            ) : (
              <View style={styles.meaningsList}>
                {wordDetail.meanings.map((meaning, mIndex) => {
                  const partOfSpeechFormatted =
                    meaning.partOfSpeech.charAt(0).toUpperCase() +
                    meaning.partOfSpeech.slice(1);

                  return (
                    <View key={`meaning-${mIndex}`} style={styles.meaningItem}>
                      {meaning.definitions.map((def, dIndex) => (
                        <View key={`def-${dIndex}`} style={styles.definitionRow}>
                          <Text style={styles.definitionText}>
                            <Text style={styles.partOfSpeechText}>
                              {partOfSpeechFormatted}
                            </Text>
                            {' - '}
                            {def.definition}
                          </Text>
                          {def.example && (
                            <Text style={styles.exampleText}>
                              Exemplo: &ldquo;{def.example}&rdquo;
                            </Text>
                          )}
                        </View>
                      ))}
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>

          {/* Bottom Navigation Buttons (Wireframe: Voltar / Próximo side-by-side with border) */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={selectPreviousWord}
              activeOpacity={0.7}
            >
              <Text style={styles.navButtonText}>Voltar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={selectNextWord}
              activeOpacity={0.7}
            >
              <Text style={styles.navButtonText}>Próximo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeButton: {
    padding: 6,
  },
  closeText: {
    fontSize: 22,
    fontWeight: '400',
    color: '#000',
  },
  favButton: {
    padding: 6,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  // Card conforme o wireframe: caixa lilás clara com borda
  wordCard: {
    backgroundColor: '#ede4ea',
    borderWidth: 1,
    borderColor: '#000',
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginBottom: 20,
  },
  wordTitle: {
    fontSize: 28,
    color: '#000',
    fontWeight: '400',
    marginBottom: 10,
    textAlign: 'center',
  },
  phoneticText: {
    fontSize: 18,
    color: '#222',
    textAlign: 'center',
  },
  phoneticTextPlaceholder: {
    fontSize: 16,
    color: '#888',
  },
  // Player de áudio conforme o wireframe
  audioPlayerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
  },
  playButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  progressBarTrack: {
    flex: 1,
    height: 12,
    backgroundColor: '#d1d5db',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#67e8f9',
    borderRadius: 6,
  },
  meaningsHeader: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 14,
  },
  meaningsList: {
    marginTop: 4,
  },
  meaningItem: {
    marginBottom: 16,
  },
  definitionRow: {
    marginBottom: 10,
  },
  partOfSpeechText: {
    fontWeight: '600',
    color: '#111827',
  },
  definitionText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  exampleText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#6b7280',
    marginTop: 4,
    marginLeft: 8,
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#6b7280',
  },
  messageBox: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#dc2626',
    textAlign: 'center',
  },
  notFoundText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  // Botões de navegação no rodapé conforme o wireframe
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    gap: 16,
  },
  navButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  navButtonText: {
    fontSize: 17,
    fontWeight: '400',
    color: '#000',
  },
});

