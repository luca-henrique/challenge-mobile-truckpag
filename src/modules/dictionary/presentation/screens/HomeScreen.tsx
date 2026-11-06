import React, { useEffect, useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWordStore } from '../state/useWordStore';
import { useAuthStore } from '../../../auth/presentation/state/useAuthStore';
import { Header, SearchBar, TabBar, WordGrid } from '../../../../widgets';
import { WordDetailModal } from '../../../../features/word-detail';
import { AuthModal } from '../../../../features/auth';
import { tokens } from '../../../../shared/theme/tokens';

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
  } = useWordStore();

  const { user, isGuest, initSession } = useAuthStore();
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const isFirstMount = useRef(true);

  const activeUserId = user ? user.id : 'guest_user';

  useEffect(() => {
    initSession();
    loadInitialWords();
  }, []);

  useEffect(() => {
    if (activeUserId) {
      loadFavorites(activeUserId);
      loadHistory(activeUserId);
    }
  }, [activeUserId, activeTab]);

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

  const currentWordsList = useMemo(() => {
    if (activeTab === 'words') return words;
    if (activeTab === 'history') return history.map((h) => h.word);
    if (activeTab === 'favorites') return favorites;
    return [];
  }, [activeTab, words, history, favorites]);

  const emptyMessage = useMemo(() => {
    if (activeTab === 'favorites') return 'Você ainda não favoritou nenhuma palavra.';
    if (activeTab === 'history') return 'Seu histórico está vazio.';
    return 'Nenhuma palavra encontrada.';
  }, [activeTab]);

  const tabTitle = activeTab === 'words' ? 'Word list' : activeTab === 'history' ? 'History' : 'Favorites';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header user={user} isGuest={isGuest} onPressProfile={() => setAuthModalVisible(true)} />
        <SearchBar value={searchInput} onChangeText={setSearchInput} />
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{tabTitle}</Text>
        </View>

        <WordGrid
          words={currentWordsList}
          onSelectWord={selectWord}
          onEndReached={activeTab === 'words' && hasMoreWords ? loadMoreWords : undefined}
          isLoadingMore={isLoadingWords}
          emptyMessage={emptyMessage}
        />

        <WordDetailModal visible={!!selectedWord} onClose={() => selectWord(null)} />
        <AuthModal visible={authModalVisible} onClose={() => setAuthModalVisible(false)} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  container: {
    flex: 1,
  },
  sectionHeader: {
    marginHorizontal: tokens.spacing.xl,
    marginTop: tokens.spacing.md,
  },
  sectionTitle: {
    fontSize: tokens.typography.lg.fontSize,
    fontWeight: '400',
    color: tokens.colors.text,
  },
});
