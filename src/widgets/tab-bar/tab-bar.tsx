import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { tokens } from '../../shared/theme/tokens';

export type TabType = 'words' | 'history' | 'favorites';

export interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        accessibilityRole="tab"
        accessibilityState={{ selected: activeTab === 'words' }}
        style={[styles.tab, activeTab === 'words' && styles.activeTab]}
        onPress={() => onTabChange('words')}
      >
        <Text style={styles.tabText}>Word list</Text>
      </TouchableOpacity>

      <TouchableOpacity
        accessibilityRole="tab"
        accessibilityState={{ selected: activeTab === 'history' }}
        style={[styles.tab, activeTab === 'history' && styles.activeTab]}
        onPress={() => onTabChange('history')}
      >
        <Text style={styles.tabText}>History</Text>
      </TouchableOpacity>

      <TouchableOpacity
        accessibilityRole="tab"
        accessibilityState={{ selected: activeTab === 'favorites' }}
        style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
        onPress={() => onTabChange('favorites')}
      >
        <Text style={styles.tabText}>Favorites</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: tokens.colors.borderDark,
    marginHorizontal: tokens.spacing.xl,
    marginTop: tokens.spacing.md,
    backgroundColor: tokens.colors.surface,
  },
  tab: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: tokens.colors.borderDark,
    backgroundColor: tokens.colors.surface,
  },
  activeTab: {
    backgroundColor: tokens.colors.activeTab,
  },
  tabText: {
    fontSize: tokens.typography.base.fontSize,
    fontWeight: '400',
    color: tokens.colors.text,
  },
});

