import React from 'react';
import {
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

interface WordGridProps {
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
  if (words.length === 0 && !isLoadingMore) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={words}
      keyExtractor={(item, index) => `${item}-${index}`}
      numColumns={3}
      style={styles.list}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={true}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      renderItem={({ item, index }) => {
        // Coluna 0, 1 ou 2
        const col = index % 3;
        const isRightColumn = col === 2;

        return (
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.cell,
              !isRightColumn && styles.borderRight,
            ]}
            onPress={() => onSelectWord(item)}
          >
            <Text style={styles.wordText} numberOfLines={1} ellipsizeMode="tail">
              {item}
            </Text>
          </TouchableOpacity>
        );
      }}
      ListFooterComponent={
        isLoadingMore ? (
          <View style={styles.footerLoader}>
            <ActivityIndicator size="small" color="#4b5563" />
          </View>
        ) : undefined
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    borderTopWidth: 1,
    borderColor: '#4b5563',
  },
  cell: {
    flex: 1 / 3,
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: '#4b5563',
    backgroundColor: '#fff',
  },
  borderRight: {
    borderRightWidth: 1,
    borderColor: '#4b5563',
  },
  wordText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '400',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
