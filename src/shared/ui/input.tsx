import React from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
} from 'react-native';
import { tokens } from '../theme/tokens';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  style,
  ...rest
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={tokens.colors.textMuted}
        accessibilityLabel={label}
        {...rest}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: tokens.spacing.md,
  },
  label: {
    fontSize: tokens.typography.sm.fontSize,
    fontWeight: '600',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.xs,
  },
  input: {
    minHeight: tokens.touch.minTarget,
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.md,
    fontSize: tokens.typography.base.fontSize,
    color: tokens.colors.text,
  },
  inputError: {
    borderColor: tokens.colors.error,
  },
  errorText: {
    fontSize: tokens.typography.xs.fontSize,
    color: tokens.colors.error,
    marginTop: tokens.spacing.xs,
  },
});
