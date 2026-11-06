import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input } from '../../../shared/ui/input';
import { FormErrors } from '../model/auth.schema';

export interface AuthFormFieldsProps {
  isRegisterMode: boolean;
  name: string;
  email: string;
  password: string;
  formErrors: FormErrors;
  onChangeName: (text: string) => void;
  onChangeEmail: (text: string) => void;
  onChangePassword: (text: string) => void;
  onSubmit: () => void;
}

export const AuthFormFields: React.FC<AuthFormFieldsProps> = ({
  isRegisterMode,
  name,
  email,
  password,
  formErrors,
  onChangeName,
  onChangeEmail,
  onChangePassword,
  onSubmit,
}) => {
  const emailInputRef = useRef<any>(null);
  const passwordInputRef = useRef<any>(null);

  return (
    <View style={styles.container}>
      {isRegisterMode && (
        <Input
          testID="name-input"
          label="Nome completo"
          placeholder="Ex: João da Silva"
          value={name}
          onChangeText={onChangeName}
          error={formErrors.name}
          returnKeyType="next"
          onSubmitEditing={() => emailInputRef.current?.focus()}
        />
      )}

      <Input
        inputRef={emailInputRef}
        testID="email-input"
        label="E-mail"
        placeholder="seu.email@exemplo.com"
        value={email}
        onChangeText={onChangeEmail}
        error={formErrors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
        onSubmitEditing={() => passwordInputRef.current?.focus()}
      />

      <Input
        inputRef={passwordInputRef}
        testID="password-input"
        label="Senha"
        placeholder="Mínimo de 4 caracteres"
        value={password}
        onChangeText={onChangePassword}
        error={formErrors.password}
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={onSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
