import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { tokens } from '../../../shared/theme/tokens';

export interface ModalNavigationBarProps {
  onPrevious: () => void;
  onNext: () => void;
}

export const ModalNavigationBar: React.FC<ModalNavigationBarProps> = ({
  onPrevious,
  onNext,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPrevious}
        style={styles.navButton}
        accessibilityRole="button"
        accessibilityLabel="Palavra anterior"
        hitSlop={tokens.touch.hitSlop}
      >
        <Text style={styles.navButtonText}>Voltar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onNext}
        style={styles.navButton}
        accessibilityRole="button"
        accessibilityLabel="Próxima palavra"
        hitSlop={tokens.touch.hitSlop}
      >
        <Text style={styles.navButtonText}>Próximo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.xl,
    paddingVertical: tokens.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
    backgroundColor: tokens.colors.surface,
  },
  navButton: {
    flex: 0.48,
    minHeight: 44,
    borderWidth: 1,
    borderColor: tokens.colors.borderDark,
    borderRadius: tokens.radius.none,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.surface,
  },
  navButtonText: {
    fontSize: tokens.typography.base.fontSize,
    fontWeight: '500',
    color: tokens.colors.text,
  },
});

