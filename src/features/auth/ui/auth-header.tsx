import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../../../shared/theme/tokens';

export interface AuthHeaderProps {
  isRegisterMode: boolean;
  onToggleMode: (registerMode: boolean) => void;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  isRegisterMode,
  onToggleMode,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="book-outline" size={32} color={tokens.colors.primary} />
      </View>
      <Text style={styles.title}>Free Dictionary</Text>
      <Text style={styles.subtitle}>Mobile Challenge TruckPag</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          testID="tab-login"
          accessibilityRole="tab"
          accessibilityState={{ selected: !isRegisterMode }}
          style={[styles.tab, !isRegisterMode && styles.activeTab]}
          onPress={() => onToggleMode(false)}
        >
          <Text style={[styles.tabText, !isRegisterMode && styles.activeTabText]}>
            Entrar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="tab-register"
          accessibilityRole="tab"
          accessibilityState={{ selected: isRegisterMode }}
          style={[styles.tab, isRegisterMode && styles.activeTab]}
          onPress={() => onToggleMode(true)}
        >
          <Text style={[styles.tabText, isRegisterMode && styles.activeTabText]}>
            Cadastrar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: tokens.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.md,
  },
  title: {
    fontSize: tokens.typography.xxl.fontSize,
    fontWeight: '700',
    color: tokens.colors.text,
  },
  subtitle: {
    fontSize: tokens.typography.sm.fontSize,
    color: tokens.colors.textSecondary,
    marginTop: tokens.spacing.xs,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: tokens.spacing.lg,
    backgroundColor: tokens.colors.border,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.xs,
    width: '100%',
  },
  tab: {
    flex: 1,
    paddingVertical: tokens.spacing.sm,
    alignItems: 'center',
    borderRadius: tokens.radius.sm,
  },
  activeTab: {
    backgroundColor: tokens.colors.surface,
  },
  tabText: {
    fontSize: tokens.typography.sm.fontSize,
    fontWeight: '500',
    color: tokens.colors.textSecondary,
  },
  activeTabText: {
    fontWeight: '700',
    color: tokens.colors.primary,
  },
});

