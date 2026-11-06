import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { tokens } from '../theme/tokens';

export interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  color?: string;
  weight?: 'normal' | '500' | '600' | '700';
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body',
  color = tokens.colors.text,
  weight,
  style,
  ...rest
}) => {
  return (
    <Text
      style={[
        styles[variant],
        { color },
        weight ? { fontWeight: weight } : null,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: tokens.typography.xxl.fontSize,
    lineHeight: tokens.typography.xxl.lineHeight,
    fontWeight: '700',
  },
  h2: {
    fontSize: tokens.typography.xl.fontSize,
    lineHeight: tokens.typography.xl.lineHeight,
    fontWeight: '700',
  },
  h3: {
    fontSize: tokens.typography.lg.fontSize,
    lineHeight: tokens.typography.lg.lineHeight,
    fontWeight: '600',
  },
  body: {
    fontSize: tokens.typography.base.fontSize,
    lineHeight: tokens.typography.base.lineHeight,
    fontWeight: '400',
  },
  label: {
    fontSize: tokens.typography.sm.fontSize,
    lineHeight: tokens.typography.sm.lineHeight,
    fontWeight: '500',
  },
  caption: {
    fontSize: tokens.typography.xs.fontSize,
    lineHeight: tokens.typography.xs.lineHeight,
    fontWeight: '400',
  },
});

