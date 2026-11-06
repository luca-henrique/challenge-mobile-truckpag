import { IAuthRepository } from '../domain/repositories/auth.repository.interface';
import { User } from '../domain/entities/user';

/**
 * Implementação pronta para integração com o Supabase Auth.
 * Quando as chaves do Supabase forem configuradas no .env, basta instanciar este repositório
 * no Container de Injeção de Dependência (DI Container).
 */
export class SupabaseAuthRepository implements IAuthRepository {
  constructor(
    private readonly supabaseUrl?: string,
    private readonly supabaseAnonKey?: string
  ) {}

  async signIn(_email: string, _password: string): Promise<User> {
    throw new Error('Supabase ainda não configurado. Use o LocalAuthRepository no DI container.');
  }

  async signUp(_email: string, _password: string, _name?: string): Promise<User> {
    throw new Error('Supabase ainda não configurado. Use o LocalAuthRepository no DI container.');
  }

  async signOut(): Promise<void> {
    throw new Error('Supabase ainda não configurado.');
  }

  async getCurrentUser(): Promise<User | null> {
    return null;
  }
}

