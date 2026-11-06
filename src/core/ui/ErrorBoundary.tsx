import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tokens } from '../../shared/theme/tokens';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturou um erro:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Ionicons name="warning-outline" size={40} color={tokens.colors.error} />
          </View>
          <Text style={styles.title}>Tivemos um contratempo inesperado</Text>
          <Text style={styles.message}>Não se preocupe, seus dados continuam seguros. Vamos tentar recarregar a tela.</Text>
          {this.state.error && <Text style={styles.errorDetails} numberOfLines={3}>{this.state.error.message}</Text>}
          <TouchableOpacity style={styles.resetButton} onPress={this.handleReset} hitSlop={tokens.touch.hitSlop} accessibilityRole="button">
            <Ionicons name="refresh-outline" size={18} color={tokens.colors.surface} />
            <Text style={styles.resetButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tokens.colors.surface, justifyContent: 'center', alignItems: 'center', padding: tokens.spacing.xxl },
  content: { alignItems: 'center', maxWidth: 360 },
  iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: tokens.colors.errorLight, justifyContent: 'center', alignItems: 'center', marginBottom: tokens.spacing.lg },
  title: { fontSize: tokens.typography.xl.fontSize, fontWeight: '700', color: tokens.colors.text, marginBottom: tokens.spacing.sm, textAlign: 'center' },
  message: { fontSize: tokens.typography.sm.fontSize, color: tokens.colors.textSecondary, textAlign: 'center', marginBottom: tokens.spacing.lg },
  errorDetails: { fontSize: tokens.typography.xs.fontSize, color: tokens.colors.error, backgroundColor: tokens.colors.errorLight, padding: tokens.spacing.sm, borderRadius: tokens.radius.md, marginBottom: tokens.spacing.xl, width: '100%', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  resetButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: tokens.colors.primary, paddingVertical: tokens.spacing.md, paddingHorizontal: tokens.spacing.xxl, borderRadius: tokens.radius.md, gap: tokens.spacing.sm, minHeight: tokens.touch.minTarget },
  resetButtonText: { color: tokens.colors.surface, fontSize: tokens.typography.sm.fontSize, fontWeight: '600' },
});
