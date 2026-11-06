import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../../../shared/theme/tokens';

export interface WordDetailTopBarProps {
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
}

export const WordDetailTopBar: React.FC<WordDetailTopBarProps> = ({
  isFavorite,
  onClose,
  onToggleFavorite,
}) => {
  return (
    <View style={styles.topBar}>
      <TouchableOpacity
        onPress={onClose}
        style={styles.closeButton}
        hitSlop={tokens.touch.hitSlop}
        accessibilityRole="button"
        accessibilityLabel="Fechar modal"
      >
        <Text style={styles.closeIcon}>X</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onToggleFavorite}
        style={styles.favoriteButton}
        hitSlop={tokens.touch.hitSlop}
        accessibilityRole="button"
        accessibilityLabel={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={28}
          color={isFavorite ? tokens.colors.favorite : tokens.colors.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.xl,
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.sm,
  },
  closeButton: {
    padding: tokens.spacing.xs,
    minWidth: tokens.touch.minTarget,
    minHeight: tokens.touch.minTarget,
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: tokens.typography.xl.fontSize,
    fontWeight: '400',
    color: tokens.colors.text,
  },
  favoriteButton: {
    padding: tokens.spacing.xs,
    minWidth: tokens.touch.minTarget,
    minHeight: tokens.touch.minTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

