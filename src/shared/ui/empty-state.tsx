import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../theme/tokens';
import { Button } from './button';

export interface EmptyStateProps {
  iconName?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  iconName = 'cube-outline',
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <Ionicons name={iconName} size={48} color={tokens.colors.textMuted} />
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {actionLabel && onAction && (
        <Button
          label={actionLabel}
          onPress={onAction}
          variant="outline"
          style={styles.actionButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.xxxl,
  },
  title: {
    fontSize: tokens.typography.lg.fontSize,
    fontWeight: '600',
    color: tokens.colors.text,
    marginTop: tokens.spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: tokens.typography.sm.fontSize,
    color: tokens.colors.textSecondary,
    marginTop: tokens.spacing.xs,
    textAlign: 'center',
    lineHeight: tokens.typography.sm.lineHeight,
  },
  actionButton: {
    marginTop: tokens.spacing.lg,
  },
});
