import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../../shared/theme/tokens';
import { User } from '../../entities/user/model/types';

export interface HeaderProps {
  user: User | null;
  isGuest: boolean;
  onPressProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  isGuest,
  onPressProfile,
}) => {
  const profileLabel = user && !isGuest ? user.name || user.email : 'Entrar / Visitante';

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.appTitle}>Free Dictionary</Text>
        <Text style={styles.appSubtitle}>Seu vocabulário em inglês</Text>
      </View>

      <TouchableOpacity
        onPress={onPressProfile}
        style={styles.profileBadge}
        hitSlop={tokens.touch.hitSlop}
        accessibilityRole="button"
        accessibilityLabel={`Perfil: ${profileLabel}`}
      >
        <Ionicons
          name={user && !isGuest ? 'person-circle-outline' : 'log-in-outline'}
          size={18}
          color={tokens.colors.primary}
        />
        <Text style={styles.profileText} numberOfLines={1}>
          {profileLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.xl,
    paddingVertical: tokens.spacing.md,
  },
  appTitle: {
    fontSize: tokens.typography.xl.fontSize,
    fontWeight: '700',
    color: tokens.colors.text,
  },
  appSubtitle: {
    fontSize: tokens.typography.xs.fontSize,
    color: tokens.colors.textSecondary,
    marginTop: 2,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.surface,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.radius.full,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    maxWidth: 160,
  },
  profileText: {
    fontSize: tokens.typography.xs.fontSize,
    color: tokens.colors.primary,
    fontWeight: '600',
    marginLeft: tokens.spacing.xs,
  },
});
