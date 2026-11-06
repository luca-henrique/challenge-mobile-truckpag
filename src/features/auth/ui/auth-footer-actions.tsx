import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../../shared/ui/button';
import { tokens } from '../../../shared/theme/tokens';

export interface AuthFooterActionsProps {
  isRegisterMode: boolean;
  isLoading: boolean;
  generalError?: string;
  storeError?: string | null;
  onSubmit: () => void;
  onGuest: () => void;
  showGuestButton?: boolean;
}

export const AuthFooterActions: React.FC<AuthFooterActionsProps> = ({
  isRegisterMode,
  isLoading,
  generalError,
  storeError,
  onSubmit,
  onGuest,
  showGuestButton = true,
}) => {
  const displayError = generalError || storeError;

  return (
    <View style={styles.container}>
      {displayError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{displayError}</Text>
        </View>
      ) : null}

      <Button
        testID="submit-button"
        label={isRegisterMode ? 'Criar Minha Conta' : 'Acessar Conta'}
        onPress={onSubmit}
        isLoading={isLoading}
        style={styles.submitButton}
      />

      {showGuestButton && (
        <Button
          testID="guest-button"
          label="Continuar como Visitante"
          variant="outline"
          onPress={onGuest}
          style={styles.guestButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: tokens.spacing.md,
  },
  errorContainer: {
    backgroundColor: tokens.colors.errorLight,
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.md,
  },
  errorText: {
    color: tokens.colors.error,
    fontSize: tokens.typography.sm.fontSize,
    textAlign: 'center',
    fontWeight: '500',
  },
  submitButton: {
    marginBottom: tokens.spacing.md,
  },
  guestButton: {
    borderColor: tokens.colors.borderDark,
  },
});

