import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native';
import { tokens } from '../theme/tokens';

export interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'outline' | 'wireframe' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  isLoading = false,
  disabled,
  style,
  ...rest
}) => {
  const isInteractive = !disabled && !isLoading;

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled: !isInteractive, busy: isLoading }}
      hitSlop={tokens.touch.hitSlop}
      disabled={!isInteractive}
      style={[
        styles.base,
        styles[variant],
        !isInteractive && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? tokens.colors.surface : tokens.colors.primary}
        />
      ) : (
        <Text style={[styles.textBase, styles[`${variant}Text`]]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: tokens.touch.minTarget,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: tokens.colors.primary,
  },
  outline: {
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  wireframe: {
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.borderDark,
    borderRadius: tokens.radius.none,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  textBase: {
    fontSize: tokens.typography.base.fontSize,
    fontWeight: '600',
  },
  primaryText: {
    color: tokens.colors.surface,
  },
  outlineText: {
    color: tokens.colors.text,
  },
  wireframeText: {
    color: tokens.colors.text,
  },
  ghostText: {
    color: tokens.colors.primary,
  },
});
