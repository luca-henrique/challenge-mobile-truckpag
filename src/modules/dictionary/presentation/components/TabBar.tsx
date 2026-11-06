import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TabType } from '../state/useWordStore';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.tab, activeTab === 'words' && styles.activeTab, styles.leftTab]}
        onPress={() => onTabChange('words')}
      >
        <Text style={[styles.tabText, activeTab === 'words' && styles.activeTabText]}>
          Word list
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.tab, activeTab === 'history' && styles.activeTab, styles.middleTab]}
        onPress={() => onTabChange('history')}
      >
        <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
          History
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.tab, activeTab === 'favorites' && styles.activeTab, styles.rightTab]}
        onPress={() => onTabChange('favorites')}
      >
        <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
          Favorites
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#4b5563',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  leftTab: {
    borderRightWidth: 1,
    borderColor: '#4b5563',
  },
  middleTab: {
    borderRightWidth: 1,
    borderColor: '#4b5563',
  },
  rightTab: {},
  // Aba ativa conforme o wireframe: preenchimento cinza
  activeTab: {
    backgroundColor: '#cfd4dc',
  },
  tabText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
  },
  activeTabText: {
    fontWeight: '600',
    color: '#000',
  },
});

