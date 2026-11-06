import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useWordStore } from '../state/useWordStore';
import { useAuthStore } from '../../../auth/presentation/state/useAuthStore';
import { TabBar } from '../components/TabBar';
import { WordGrid } from '../components/WordGrid';
import { WordDetailModal } from '../components/WordDetailModal';
import { AuthModal } from '../../../auth/presentation/components/AuthModal';
import { Ionicons } from '@expo/vector-icons';

export const HomeScreen: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    words,
    history,
    favorites,
    selectedWord,
    selectWord,
    loadInitialWords,
    loadMoreWords,
    isLoadingWords,
    hasMoreWords,
    setSearchTerm,
    loadFavorites,
    loadHistory,
    clearHistory,
  } = useWordStore();

  const { user, initSession } = useAuthStore();
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const activeUserId = user ? user.id : 'guest_user';

  // Inicializa sessão de autenticação e carga de palavras
  useEffect(() => {
    initSession();
    loadInitialWords();
  }, []);

  // Recarrega favoritos e histórico quando usuário ou aba mudar
  useEffect(() => {
    if (activeUserId) {
      loadFavorites(activeUserId);
      loadHistory(activeUserId);
    }
  }, [activeUserId, activeTab]);

  const isFirstMount = React.useRef(true);

  // Debounce para busca
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, setSearchTerm]);

  // Lista de palavras a ser exibida no Grid dependendo da aba ativa
  const currentWordsList = useMemo(() => {
    if (activeTab === 'words') {
      return words;
    }
    if (activeTab === 'history') {
      return history.map((h) => h.word);
    }
    if (activeTab === 'favorites') {
      return favorites;
    }
    return [];
  }, [activeTab, words, history, favorites]);

  // Título da seção conforme o wireframe ("Word list", "History", "Favorites")
  const sectionTitle = useMemo(() => {
    if (activeTab === 'words') return 'Word list';
    if (activeTab === 'history') return 'History';
    return 'Favorites';
  }, [activeTab]);

  const emptyMessage = useMemo(() => {
    if (activeTab === 'words') return 'Nenhuma palavra encontrada.';
    if (activeTab === 'history') return 'Seu histórico está vazio.\nAbra palavras para registrá-las aqui.';
    return 'Nenhuma palavra favoritada ainda.\nAbra uma palavra e toque no coração para favoritá-la.';
  }, [activeTab]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* Header Superior com Identificação e Botão de Login/Perfil */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appTitle}>Free Dictionary</Text>
            <Text style={styles.appSubtitle}>Mobile Challenge TruckPag</Text>
          </View>

          <TouchableOpacity
            style={styles.userButton}
            onPress={() => setAuthModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="person-circle-outline" size={26} color="#1f2937" />
            <Text style={styles.userButtonText} numberOfLines={1}>
              {user ? (user.name || user.email.split('@')[0]) : 'Entrar'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Barra de Pesquisa (visível na aba Word list) */}
        {activeTab === 'words' && (
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={18} color="#6b7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar termo em inglês..."
              placeholderTextColor="#9ca3af"
              value={searchInput}
              onChangeText={setSearchInput}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchInput.length > 0 && (
              <TouchableOpacity onPress={() => setSearchInput('')} style={styles.clearSearch}>
                <Ionicons name="close-circle" size={18} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* 3 Abas no topo conforme o wireframe */}
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Título da Seção conforme o wireframe */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{sectionTitle}</Text>
          {activeTab === 'history' && history.length > 0 && (
            <TouchableOpacity onPress={() => clearHistory(activeUserId)}>
              <Text style={styles.clearHistoryText}>Limpar histórico</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Grid de 3 Colunas com Rolagem Infinita conforme o wireframe */}
        <View style={styles.gridWrapper}>
          <WordGrid
            words={currentWordsList}
            onSelectWord={(word) => selectWord(word)}
            onEndReached={activeTab === 'words' ? loadMoreWords : undefined}
            isLoadingMore={activeTab === 'words' && isLoadingWords && words.length > 0}
            emptyMessage={emptyMessage}
          />
        </View>

        {/* Modal de Detalhes da Palavra (Screen 2 conforme o wireframe) */}
        <WordDetailModal
          visible={!!selectedWord}
          onClose={() => selectWord(null)}
        />

        {/* Modal de Autenticação / Perfil (Diferencial 4) */}
        <AuthModal
          visible={authModalVisible}
          onClose={() => setAuthModalVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  appSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    maxWidth: 160,
    gap: 6,
  },
  userButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 6,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  clearSearch: {
    padding: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#000',
  },
  clearHistoryText: {
    fontSize: 13,
    color: '#ef4444',
    fontWeight: '500',
  },
  gridWrapper: {
    flex: 1,
  },
});
