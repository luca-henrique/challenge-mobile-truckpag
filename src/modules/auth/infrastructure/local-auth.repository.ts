import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IAuthRepository } from '../domain/repositories/auth.repository.interface';
import { User } from '../domain/entities/user';
import { getDatabase } from '../../../core/storage/database';

const SESSION_KEY = '@truckpag:auth_user_id';

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  name: string | null;
  created_at: string;
}

export class LocalAuthRepository implements IAuthRepository {
  private async hashPassword(password: string): Promise<string> {
    return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
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
    const passwordHash = await this.hashPassword(password);
    const createdAt = new Date().toISOString();
    const userName = name?.trim() || cleanEmail.split('@')[0];

    await db.runAsync(
      'INSERT INTO users (id, email, password_hash, name, created_at) VALUES (?, ?, ?, ?, ?)',
      [id, cleanEmail, passwordHash, userName, createdAt]
    );

    const user: User = {
      id,
      email: cleanEmail,
      name: userName,
      createdAt,
    };

    await AsyncStorage.setItem(SESSION_KEY, id);
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

    const passwordHash = await this.hashPassword(password);
    if (userRow.password_hash !== passwordHash) {
      throw new Error('Senha incorreta.');
    }

    const user: User = {
      id: userRow.id,
      email: userRow.email,
      name: userRow.name || undefined,
      createdAt: userRow.created_at,
    };

    await AsyncStorage.setItem(SESSION_KEY, user.id);
    return user;
  }

  async signOut(): Promise<void> {
    await AsyncStorage.removeItem(SESSION_KEY);
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const activeId = await AsyncStorage.getItem(SESSION_KEY);
      if (!activeId) {
        return null;
      }

      const db = await getDatabase();
      const userRow = await db.getFirstAsync<UserRow>(
        'SELECT * FROM users WHERE id = ?',
        [activeId]
      );

      if (!userRow) {
        await AsyncStorage.removeItem(SESSION_KEY);
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

