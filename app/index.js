import { StyleSheet, Text, View } from 'react-native';
import Logo from '../assets/images/logo.svg'; // Importamos o logo diretamente aqui para simplificar
import { COLORS } from '../constants/colors';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      {/* Usando o logo diretamente na tela */}
      <Logo width={200} height={80} />

      <Text style={styles.title}>Bem-vindo ao Sala Fácil!</Text>
      <Text style={styles.subtitle}>Seu app para agendamento de salas na Antonelly.</Text>
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
    gap: 20, // Adiciona um espaço entre os itens
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
});