import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { tokens } from '../../../shared/theme/tokens';

export interface WordHeaderCardProps {
  word: string;
  phonetic?: string;
}

export const WordHeaderCard: React.FC<WordHeaderCardProps> = ({ word, phonetic }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.wordTitle} numberOfLines={2} ellipsizeMode="tail">
        {word}
      </Text>
      <Text style={styles.phoneticText}>
        {phonetic || '/ - /'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.cardHighlight,
    borderWidth: 1,
    borderColor: tokens.colors.cardBorder,
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.xl,
    marginHorizontal: tokens.spacing.xl,
    marginVertical: tokens.spacing.md,
  },
  wordTitle: {
    fontSize: tokens.typography.xxl.fontSize + 4,
    fontWeight: '500',
    color: tokens.colors.text,
    textAlign: 'center',
    marginBottom: tokens.spacing.md,
  },
  phoneticText: {
    fontSize: tokens.typography.lg.fontSize,
    color: tokens.colors.text,
    textAlign: 'center',
  },
});
