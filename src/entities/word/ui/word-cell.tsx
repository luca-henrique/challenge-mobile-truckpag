import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { tokens } from '../../../shared/theme/tokens';

export interface WordCellProps {
  word: string;
  onPress: (word: string) => void;
  style?: ViewStyle;
}

export const WordCell: React.FC<WordCellProps> = React.memo(({
  word,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`Palavra ${word}`}
      accessibilityHint="Toque para abrir a pronúncia e o significado da palavra"
      hitSlop={tokens.touch.hitSlop}
      activeOpacity={0.7}
      style={[styles.cell, style]}
      onPress={() => onPress(word)}
    >
      <Text style={styles.wordText} numberOfLines={1} ellipsizeMode="tail">
        {word}
      </Text>
    </TouchableOpacity>
  );
});

WordCell.displayName = 'WordCell';

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    minHeight: 74,
    backgroundColor: tokens.colors.surface,
    borderWidth: 0.5,
    borderColor: tokens.colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.sm,
  },
  wordText: {
    fontSize: tokens.typography.base.fontSize,
    fontWeight: '500',
    color: tokens.colors.text,
    textAlign: 'center',
  },
});

