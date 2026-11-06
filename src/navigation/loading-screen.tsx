import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { tokens } from '../shared/theme/tokens';

export const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={tokens.colors.primary} />
      <Text style={styles.loadingText}>Carregando dicionário...</Text>
      <Text style={styles.subText}>Preparando o vocabulário para você</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.background,
  },
  loadingText: {
    marginTop: tokens.spacing.md,
    fontSize: tokens.typography.sm.fontSize,
    color: tokens.colors.text,
    fontWeight: '600',
  },
  subText: {
    marginTop: tokens.spacing.xs,
    fontSize: tokens.typography.xs.fontSize,
    color: tokens.colors.textSecondary,
  },
});

