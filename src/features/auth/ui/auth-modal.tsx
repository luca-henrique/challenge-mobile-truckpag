import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../../../shared/theme/tokens';
import { useAuthForm } from '../model/use-auth-form';
import { AuthHeader } from './auth-header';
import { AuthFormFields } from './auth-form-fields';
import { AuthFooterActions } from './auth-footer-actions';

export interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose }) => {
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
  } = useAuthForm(onClose);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerBar}>
          <TouchableOpacity
            hitSlop={tokens.touch.hitSlop}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Fechar modal de autenticação"
          >
            <Ionicons name="close" size={28} color={tokens.colors.text} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
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
              onGuest={onClose}
              showGuestButton={false}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  headerBar: {
    paddingHorizontal: tokens.spacing.lg,
    paddingTop: tokens.spacing.sm,
    alignItems: 'flex-start',
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

