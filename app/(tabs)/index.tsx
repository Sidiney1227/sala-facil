import { StyleSheet, View, Text } from 'react-native';
import { Construction, Calendar } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { COLORS } from '@/constants/colors';
import Logo from '../../assets/images/logo.svg';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Logo width={180} height={72} />

        <Text style={styles.title}>Bem-vindo ao App de Agendamento</Text>

        <Text style={styles.subtitle}>
          Olá, {user?.name || 'Usuário'}!
        </Text>

        <View style={styles.card}>
          <Construction size={48} color={COLORS.warning} />
          <Text style={styles.cardTitle}>Fase de Desenvolvimento</Text>
          <Text style={styles.cardText}>
            Este aplicativo está em fase de desenvolvimento.
            Utilize a aba "Reservas" para gerenciar suas reservas de salas.
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Calendar size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>
            Acesse a aba Reservas para criar e gerenciar suas reservas
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.foreground,
    textAlign: 'center',
    marginBottom: 32,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.foreground,
    marginBottom: 12,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 14,
    color: COLORS.mutedForeground,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.card,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    width: '100%',
    maxWidth: 400,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.foreground,
    lineHeight: 20,
  },
});
