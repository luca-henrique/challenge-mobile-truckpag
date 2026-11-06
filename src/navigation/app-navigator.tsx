import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { tokens } from '../shared/theme/tokens';
import { RootNavigator } from './root-navigator';

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: tokens.colors.background,
    card: tokens.colors.surface,
    text: tokens.colors.text,
    border: tokens.colors.border,
    primary: tokens.colors.primary,
  },
};

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer theme={AppTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
};
