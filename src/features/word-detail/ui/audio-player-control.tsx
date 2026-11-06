import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../../../shared/theme/tokens';

export interface AudioPlayerControlProps {
  isPlaying: boolean;
  progress: number;
  onTogglePlay: () => void;
}

export const AudioPlayerControl: React.FC<AudioPlayerControlProps> = ({
  isPlaying,
  progress,
  onTogglePlay,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onTogglePlay}
        style={styles.playButton}
        hitSlop={tokens.touch.hitSlop}
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? 'Pausar áudio de pronúncia' : 'Reproduzir áudio de pronúncia'}
      >
        <Ionicons
          name={isPlaying ? 'pause' : 'play-outline'}
          size={36}
          color={tokens.colors.cardBorder}
        />
      </TouchableOpacity>

      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${Math.round(Math.min(1, Math.max(0, progress)) * 100)}%` },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: tokens.spacing.xl,
    marginVertical: tokens.spacing.md,
  },
  playButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.md,
  },
  track: {
    flex: 1,
    height: 12,
    backgroundColor: tokens.colors.audioTrack,
    borderRadius: tokens.radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: tokens.colors.audioProgress,
    borderRadius: tokens.radius.full,
  },
});

