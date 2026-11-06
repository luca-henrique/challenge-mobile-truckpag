import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { IAuthRepository } from '../domain/repositories/auth.repository.interface';
import { User } from '../domain/entities/user';
import { getDatabase } from '../../../core/storage/database';

const SESSION_KEY = 'truckpag_auth_user_id';

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  password_hash: string;
  salt: string;
  created_at: string;
}

export class LocalAuthRepository implements IAuthRepository {
  /**
   * Calcula o hash SHA-256 com Salt único para proteção contra ataques de rainbow table
   */
  private async hashPassword(password: string, salt: string): Promise<string> {
    return Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      `${salt}:${password}`
    );
  }

  async signUp(email: string, password: string, name?: string): Promise<User> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      throw new Error('Email e senha são obrigatórios.');
    }
    if (password.length < 6) {
      throw new Error('A senha deve ter no mínimo 6 caracteres.');
    }

    const db = await getDatabase();
    const existing = await db.getFirstAsync<UserRow>(
      'SELECT id FROM users WHERE email = ?',
      [cleanEmail]
    );

    if (existing) {
      throw new Error('Este email já está cadastrado.');
    }

    const id = Crypto.randomUUID();
    const salt = Crypto.randomUUID();
    const passwordHash = await this.hashPassword(password, salt);
    const createdAt = new Date().toISOString();
    const userName = name?.trim() || cleanEmail.split('@')[0];

    await db.runAsync(
      'INSERT INTO users (id, name, email, password_hash, salt, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [id, userName, cleanEmail, passwordHash, salt, createdAt]
    );

    const user: User = {
      id,
      email: cleanEmail,
      name: userName,
      createdAt,
    };

    await SecureStore.setItemAsync(SESSION_KEY, id);
    return user;
  }

  async signIn(email: string, password: string): Promise<User> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      throw new Error('Informe email e senha.');
    }

    const db = await getDatabase();
    const userRow = await db.getFirstAsync<UserRow>(
      'SELECT * FROM users WHERE email = ?',
      [cleanEmail]
    );

    if (!userRow) {
      throw new Error('Usuário não encontrado.');
    }

    const passwordHash = await this.hashPassword(password, userRow.salt);
    if (userRow.password_hash !== passwordHash) {
      throw new Error('Senha incorreta.');
    }

    const user: User = {
      id: userRow.id,
      email: userRow.email,
      name: userRow.name || undefined,
      createdAt: userRow.created_at,
    };

    await SecureStore.setItemAsync(SESSION_KEY, user.id);
    return user;
  }

  async signOut(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(SESSION_KEY);
    } catch {
      // Ignora erro se a chave não existir
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const activeId = await SecureStore.getItemAsync(SESSION_KEY);
      if (!activeId) {
        return null;
      }

      const db = await getDatabase();
      const userRow = await db.getFirstAsync<UserRow>(
        'SELECT * FROM users WHERE id = ?',
        [activeId]
      );

      if (!userRow) {
        await SecureStore.deleteItemAsync(SESSION_KEY);
        return null;
      }

      return {
        id: userRow.id,
        email: userRow.email,
        name: userRow.name || undefined,
        createdAt: userRow.created_at,
      };
    } catch {
      return null;
    }
  }
}
