import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Building2, Key, IdCard, CheckCircle2, XCircle, LogOut } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { COLORS } from '@/constants/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Confirmar Logout',
      'Deseja realmente sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ]
    );
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return COLORS.destructive;
      case 'PORTARIA':
        return COLORS.warning;
      case 'USER':
        return COLORS.info;
      default:
        return COLORS.muted;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrador';
      case 'PORTARIA':
        return 'Portaria';
      case 'USER':
        return 'Usuário';
      default:
        return role;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name || 'Usuário'}</Text>
        <View style={[styles.roleBadge, { backgroundColor: getRoleBadgeColor(user?.role || '') }]}>
          <Text style={styles.roleText}>{getRoleLabel(user?.role || '')}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações da Conta</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Mail size={18} color={COLORS.mutedForeground} />
              <Text style={styles.infoLabel}>Email</Text>
            </View>
            <Text style={styles.infoValue}>{user?.email || '-'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Building2 size={18} color={COLORS.mutedForeground} />
              <Text style={styles.infoLabel}>Setor</Text>
            </View>
            <Text style={styles.infoValue}>{user?.sector || 'Não informado'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Key size={18} color={COLORS.mutedForeground} />
              <Text style={styles.infoLabel}>Nível de Acesso</Text>
            </View>
            <Text style={styles.infoValue}>{getRoleLabel(user?.role || '')}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <IdCard size={18} color={COLORS.mutedForeground} />
              <Text style={styles.infoLabel}>ID do Usuário</Text>
            </View>
            <Text style={styles.infoValue}>{user?.id || '-'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Permissões</Text>

        <View style={styles.infoCard}>
          <View style={styles.permissionRow}>
            {user?.role === 'ADMIN' ? (
              <CheckCircle2 size={18} color={COLORS.success} />
            ) : (
              <XCircle size={18} color={COLORS.destructive} />
            )}
            <Text style={styles.permissionText}>Gerenciar todas as reservas</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.permissionRow}>
            {user?.role === 'ADMIN' || user?.role === 'PORTARIA' ? (
              <CheckCircle2 size={18} color={COLORS.success} />
            ) : (
              <XCircle size={18} color={COLORS.destructive} />
            )}
            <Text style={styles.permissionText}>Cancelar qualquer reserva</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.permissionRow}>
            <CheckCircle2 size={18} color={COLORS.success} />
            <Text style={styles.permissionText}>Criar novas reservas</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.permissionRow}>
            <CheckCircle2 size={18} color={COLORS.success} />
            <Text style={styles.permissionText}>Visualizar todas as reservas</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color={COLORS.foreground} />
        <Text style={styles.logoutButtonText}>Sair da Conta</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>App de Agendamento Antonelly</Text>
        <Text style={styles.footerVersion}>v1.0.0 - Beta</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.foreground,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.foreground,
    marginBottom: 8,
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.foreground,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.foreground,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoRow: {
    paddingVertical: 8,
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.mutedForeground,
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.foreground,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  permissionText: {
    fontSize: 14,
    color: COLORS.foreground,
    lineHeight: 20,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.destructive,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 32,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.mutedForeground,
  },
  footerVersion: {
    fontSize: 10,
    color: COLORS.mutedForeground,
    marginTop: 4,
  },
});
