import React, { useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { WordCell } from '../../entities/word/ui/word-cell';
import { tokens } from '../../shared/theme/tokens';

export interface WordGridProps {
  words: string[];
  onSelectWord: (word: string) => void;
  onEndReached?: () => void;
  isLoadingMore?: boolean;
  emptyMessage?: string;
}

export const WordGrid: React.FC<WordGridProps> = ({
  words,
  onSelectWord,
  onEndReached,
  isLoadingMore = false,
  emptyMessage = 'Nenhuma palavra encontrada.',
}) => {
  const renderItem = useCallback(
    ({ item }: { item: string }) => <WordCell word={item} onPress={onSelectWord} />,
    [onSelectWord]
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={tokens.colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{emptyMessage}</Text>
    </View>
  );

  return (
    <View style={styles.gridOuterBorder}>
      <FlatList
        data={words}
        keyExtractor={(item, index) => `${item}-${index}`}
        numColumns={3}
        renderItem={renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator
      />
    </View>
  );
};

const styles = StyleSheet.create({
  gridOuterBorder: {
    flex: 1,
    marginHorizontal: tokens.spacing.xl,
    marginTop: tokens.spacing.md,
    borderWidth: 1,
    borderColor: tokens.colors.borderDark,
    backgroundColor: tokens.colors.surface,
  },
  listContent: {
    flexGrow: 1,
  },
  footerLoader: {
    paddingVertical: tokens.spacing.lg,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.xxxl,
  },
  emptyText: {
    fontSize: tokens.typography.sm.fontSize,
    color: tokens.colors.textSecondary,
    textAlign: 'center',
  },
});

