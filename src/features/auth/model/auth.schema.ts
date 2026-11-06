export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  general?: string;
}

export function validateLoginForm(data: LoginFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.email.trim()) {
    errors.email = 'E-mail é obrigatório.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'E-mail inválido.';
  }

  if (!data.password) {
    errors.password = 'Senha é obrigatória.';
  } else if (data.password.length < 4) {
    errors.password = 'A senha deve ter no mínimo 4 caracteres.';
  }

  return errors;
}

export function validateRegisterForm(data: RegisterFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Nome é obrigatório.';
  }

  if (!data.email.trim()) {
    errors.email = 'E-mail é obrigatório.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'E-mail inválido.';
  }

  if (!data.password) {
    errors.password = 'Senha é obrigatória.';
  } else if (data.password.length < 4) {
    errors.password = 'A senha deve ter no mínimo 4 caracteres.';
  }

  return errors;
}
