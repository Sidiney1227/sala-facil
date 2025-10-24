import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Calendar, Clock, User, Building2, FileText, Info } from 'lucide-react-native';
import { StatusBadge } from '../../modules/meeting-reservations/components/StatusBadge';
import { useReservations } from '../../modules/meeting-reservations/hooks/useReservations';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatTime } from '../../modules/meeting-reservations/utils/timeUtils';
import { canCancelReservation } from '../../modules/meeting-reservations/utils/statusUpdater';
import { COLORS } from '../../constants/colors';

export default function ReservationDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { selectedReservation, selectReservation, cancel, isLoading, clearSelectedReservation } =
    useReservations();

  useEffect(() => {
    if (id) {
      selectReservation(id);
    }

    return () => {
      clearSelectedReservation();
    };
  }, [id]);

  const handleCancel = () => {
    if (!selectedReservation) return;

    // Verifica se pode cancelar
    if (!canCancelReservation(selectedReservation.status)) {
      Alert.alert('Erro', 'Não é possível cancelar uma reserva com este status');
      return;
    }

    // Verifica permissões
    const canUserCancel =
      user?.role === 'ADMIN' ||
      user?.role === 'PORTARIA' ||
      (user?.role === 'USER' && selectedReservation.userId === user?.id);

    if (!canUserCancel) {
      Alert.alert('Erro', 'Você não tem permissão para cancelar esta reserva');
      return;
    }

    Alert.alert(
      'Confirmar Cancelamento',
      `Deseja realmente cancelar a reserva "${selectedReservation.title}"?`,
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, Cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancel(selectedReservation.id);
              Alert.alert('Sucesso', 'Reserva cancelada com sucesso', [
                { text: 'OK', onPress: () => router.back() },
              ]);
            } catch (error) {
              Alert.alert(
                'Erro',
                error instanceof Error ? error.message : 'Erro ao cancelar reserva'
              );
            }
          },
        },
      ]
    );
  };

  if (isLoading || !selectedReservation) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando detalhes...</Text>
      </View>
    );
  }

  const canUserCancel =
    user?.role === 'ADMIN' ||
    user?.role === 'PORTARIA' ||
    (user?.role === 'USER' && selectedReservation.userId === user?.id);

  const showCancelButton =
    canUserCancel && canCancelReservation(selectedReservation.status);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{selectedReservation.title}</Text>
            <Text style={styles.room}>{selectedReservation.roomName}</Text>
          </View>
          <StatusBadge status={selectedReservation.status} size="medium" />
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Data e Horário</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Data:</Text>
            <Text style={styles.infoValue}>{formatDate(selectedReservation.date)}</Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Clock size={16} color={COLORS.mutedForeground} />
              <Text style={styles.infoLabel}>Horário:</Text>
            </View>
            <Text style={styles.infoValue}>
              {formatTime(selectedReservation.startTime)} -{' '}
              {formatTime(selectedReservation.endTime)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Responsável</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nome:</Text>
            <Text style={styles.infoValue}>{selectedReservation.userName}</Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoLabelContainer}>
              <Building2 size={16} color={COLORS.mutedForeground} />
              <Text style={styles.infoLabel}>Setor:</Text>
            </View>
            <Text style={styles.infoValue}>{selectedReservation.sector}</Text>
          </View>
        </View>

        {selectedReservation.description && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <FileText size={20} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Descrição</Text>
              </View>
              <Text style={styles.description}>{selectedReservation.description}</Text>
            </View>
          </>
        )}

        <View style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Informações</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID:</Text>
            <Text style={styles.infoValue}>{selectedReservation.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <Text style={styles.infoValue}>{selectedReservation.status}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={() => router.back()}>
          <Text style={styles.buttonTextSecondary}>Voltar</Text>
        </TouchableOpacity>
        {showCancelButton && (
          <TouchableOpacity
            style={[styles.button, styles.buttonDanger, isLoading && styles.buttonDisabled]}
            onPress={handleCancel}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.foreground} />
            ) : (
              <Text style={styles.buttonTextDanger}>Cancelar Reserva</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.mutedForeground,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.foreground,
    marginBottom: 4,
    flex: 1,
  },
  room: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 20,
  },
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.foreground,
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.mutedForeground,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.foreground,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: COLORS.foreground,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonDanger: {
    backgroundColor: COLORS.destructive,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonTextSecondary: {
    color: COLORS.foreground,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextDanger: {
    color: COLORS.foreground,
    fontSize: 16,
    fontWeight: '700',
  },
});
