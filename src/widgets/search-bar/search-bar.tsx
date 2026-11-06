import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../../shared/theme/tokens';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Pesquisar termo em inglês...',
}) => {
  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={18} color={tokens.colors.textSecondary} style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor={tokens.colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel="Campo de pesquisa de palavras"
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText('')}
          hitSlop={tokens.touch.hitSlop}
          accessibilityRole="button"
          accessibilityLabel="Limpar pesquisa"
        >
          <Ionicons name="close-circle" size={18} color={tokens.colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.surface,
    marginHorizontal: tokens.spacing.xl,
    marginVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    minHeight: tokens.touch.minTarget,
  },
  searchIcon: {
    marginRight: tokens.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: tokens.typography.sm.fontSize,
    color: tokens.colors.text,
    paddingVertical: tokens.spacing.sm,
  },
});

