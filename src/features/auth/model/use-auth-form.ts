import { useState, useCallback } from 'react';
import { useAuthStore } from '../../../modules/auth/presentation/state/useAuthStore';
import { validateLoginForm, validateRegisterForm, FormErrors } from './auth.schema';

export function useAuthForm(onSuccess?: () => void) {
  const { signIn, signUp, continueAsGuest, isLoading, error: storeError, clearError } = useAuthStore();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const toggleMode = useCallback((registerMode: boolean) => {
    setIsRegisterMode(registerMode);
    setFormErrors({});
    clearError();
  }, [clearError]);

  const handleSubmit = useCallback(async () => {
    setFormErrors({});
    clearError();

    if (isRegisterMode) {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setFormErrors({ general: 'Preencha todos os campos obrigatórios.' });
        return;
      }
      const errors = validateRegisterForm({ name, email, password });
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
      try {
        await signUp(email, password, name);
        if (onSuccess) onSuccess();
      } catch {
        // Erro gerenciado no storeError
      }
    } else {
      if (!email.trim() || !password.trim()) {
        setFormErrors({ general: 'Preencha todos os campos obrigatórios.' });
        return;
      }
      const errors = validateLoginForm({ email, password });
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
      try {
        await signIn(email, password);
        if (onSuccess) onSuccess();
      } catch {
        // Erro gerenciado no storeError
      }
    }
  }, [isRegisterMode, name, email, password, signIn, signUp, clearError, onSuccess]);

  const handleGuest = useCallback(() => {
    continueAsGuest();
    if (onSuccess) {
      onSuccess();
    }
  }, [continueAsGuest, onSuccess]);

  return {
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
  };
}
