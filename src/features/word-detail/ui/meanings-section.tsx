import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Meaning } from '../../../entities/word/model/types';
import { tokens } from '../../../shared/theme/tokens';

export interface MeaningsSectionProps {
  isLoading: boolean;
  isError: boolean;
  meanings?: Meaning[];
}

export const MeaningsSection: React.FC<MeaningsSectionProps> = ({
  isLoading,
  isError,
  meanings,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meanings</Text>

      {isLoading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="small" color={tokens.colors.primary} />
          <Text style={styles.infoText}>Buscando definições...</Text>
        </View>
      )}

      {isError && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            Não foi possível carregar as definições. Verifique a conexão.
          </Text>
        </View>
      )}

      {!isLoading && !isError && meanings && meanings.length > 0 ? (
        <View style={styles.meaningsList}>
          {meanings.slice(0, 4).map((meaning, index) => {
            const firstDef = meaning.definitions[0];
            return (
              <View key={`${meaning.partOfSpeech}-${index}`} style={styles.meaningItem}>
                <Text style={styles.definitionText}>
                  <Text style={styles.partOfSpeech}>
                    {meaning.partOfSpeech.charAt(0).toUpperCase() + meaning.partOfSpeech.slice(1)}
                  </Text>
                  {' - '}
                  {firstDef ? firstDef.definition : 'Sem definição disponível.'}
                </Text>
                {firstDef?.example && (
                  <Text style={styles.exampleText}>
                    Exemplo: "{firstDef.example}"
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      ) : null}

      {!isLoading && !isError && (!meanings || meanings.length === 0) && (
        <Text style={styles.infoText}>Nenhuma definição detalhada encontrada.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: tokens.spacing.xl,
    marginTop: tokens.spacing.md,
  },
  title: {
    fontSize: tokens.typography.xl.fontSize,
    fontWeight: '700',
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
  },
  centerContainer: {
    paddingVertical: tokens.spacing.lg,
    alignItems: 'center',
  },
  infoText: {
    fontSize: tokens.typography.sm.fontSize,
    color: tokens.colors.textSecondary,
    marginTop: tokens.spacing.sm,
    textAlign: 'center',
  },
  errorText: {
    fontSize: tokens.typography.sm.fontSize,
    color: tokens.colors.error,
    textAlign: 'center',
  },
  meaningsList: {
    marginBottom: tokens.spacing.lg,
  },
  meaningItem: {
    marginBottom: tokens.spacing.md,
  },
  partOfSpeech: {
    fontWeight: '700',
    color: tokens.colors.text,
  },
  definitionText: {
    fontSize: tokens.typography.sm.fontSize + 1,
    lineHeight: tokens.typography.base.lineHeight,
    color: tokens.colors.text,
  },
  exampleText: {
    fontSize: tokens.typography.xs.fontSize + 1,
    fontStyle: 'italic',
    color: tokens.colors.textSecondary,
    marginTop: tokens.spacing.xs,
  },
});
