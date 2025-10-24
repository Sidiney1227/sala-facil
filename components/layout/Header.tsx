import { StyleSheet, Text, View } from 'react-native';
import Logo from '../../../assets/images/logo.svg'; // 1. Importe o SVG como um componente
import { COLORS } from '../../constants/colors';

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <Logo width={120} height={40} /> {/* 2. Use o SVG como um componente, passando tamanho */}
      <Text style={styles.headerText}>Sala Fácil</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 16,
    backgroundColor: COLORS.card, // Usando uma cor da sua paleta
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: COLORS.foreground,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default Header;