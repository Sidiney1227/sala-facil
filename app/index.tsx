import { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useRouter, useRootNavigationState } from 'expo-router';
import Logo from '../assets/images/logo.svg';
import { COLORS } from '../constants/colors';
import { useAuth } from '../context/AuthContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    // Espera o router estar pronto antes de navegar
    if (!rootNavigationState?.key) return;

    if (!isLoading) {
      // Pequeno timeout para garantir que o router está completamente montado
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          router.replace('/(tabs)');
        } else {
          router.replace('/login');
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, rootNavigationState?.key]);

  return (
    <View style={styles.container}>
      <Logo width={200} height={80} />
      <Text style={styles.title}>Bem-vindo ao Sala Fácil!</Text>
      <Text style={styles.subtitle}>Seu app para agendamento de salas na Antonelly.</Text>
      <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.foreground,
    textAlign: 'center',
  },
  loader: {
    marginTop: 20,
  },
});