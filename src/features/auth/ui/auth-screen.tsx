import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tokens } from '../../../shared/theme/tokens';
import { useAuthForm } from '../model/use-auth-form';
import { AuthHeader } from './auth-header';
import { AuthFormFields } from './auth-form-fields';
import { AuthFooterActions } from './auth-footer-actions';

export const AuthScreen: React.FC = () => {
  const {
    isRegisterMode,
    toggleMode,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    formErrors,
    storeError,
    isLoading,
    handleSubmit,
    handleGuest,
  } = useAuthForm();

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <AuthHeader
              isRegisterMode={isRegisterMode}
              onToggleMode={toggleMode}
            />

            <AuthFormFields
              isRegisterMode={isRegisterMode}
              name={name}
              email={email}
              password={password}
              formErrors={formErrors}
              onChangeName={setName}
              onChangeEmail={setEmail}
              onChangePassword={setPassword}
              onSubmit={handleSubmit}
            />

            <AuthFooterActions
              isRegisterMode={isRegisterMode}
              isLoading={isLoading}
              generalError={formErrors.general}
              storeError={storeError}
              onSubmit={handleSubmit}
              onGuest={handleGuest}
            />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: tokens.spacing.xl,
  },
});

