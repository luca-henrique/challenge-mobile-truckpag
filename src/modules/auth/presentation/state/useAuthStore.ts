import { create } from 'zustand';
import { User } from '../../domain/entities/user';
import { container } from '../../../../core/di/container';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isGuest: boolean;
  initSession: () => Promise<void>;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  error: null,
  isGuest: false,

  clearError: () => set({ error: null }),

  initSession: async () => {
    try {
      set({ isLoading: true, error: null });
      const current = await container.authRepository.getCurrentUser();
      if (current) {
        set({ user: current, isGuest: false, isLoading: false });
      } else {
        // Inicializa como guest por padrão para permitir explorar imediatamente se desejado
        set({ user: null, isGuest: false, isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message || 'Erro ao carregar sessão', isLoading: false });
    }
  },

  signIn: async (email: string, pass: string) => {
    try {
      set({ isLoading: true, error: null });
      const user = await container.authRepository.signIn(email, pass);
      set({ user, isGuest: false, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Falha no login', isLoading: false });
      throw err;
    }
  },

  signUp: async (email: string, pass: string, name?: string) => {
    try {
      set({ isLoading: true, error: null });
      const user = await container.authRepository.signUp(email, pass, name);
      set({ user, isGuest: false, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Falha no cadastro', isLoading: false });
      throw err;
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      await container.authRepository.signOut();
      try {
        const { queryClient } = require('../../../../core/network/query-client');
        if (queryClient && typeof queryClient.clear === 'function') {
          queryClient.clear();
        }
      } catch {
        // Ignora se em ambiente sem query client
      }
      set({ user: null, isGuest: false, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Falha ao deslogar', isLoading: false });
    }
  },

  continueAsGuest: () => {
    const guestUser: User = {
      id: 'guest_user',
      email: 'guest@truckpag.local',
      name: 'Visitante',
      createdAt: new Date().toISOString(),
    };
    set({ user: guestUser, isGuest: true, error: null, isLoading: false });
  },
}));
