import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { RoomSelector } from '../../modules/meeting-reservations/components/RoomSelector';
import { useReservations } from '../../modules/meeting-reservations/hooks/useReservations';
import { useRoomAvailability } from '../../modules/meeting-reservations/hooks/useRoomAvailability';
import { SECTORS } from '../../modules/meeting-reservations/constants/timeSlots';
import { getTodayString } from '../../modules/meeting-reservations/utils/timeUtils';
import { COLORS } from '../../constants/colors';

export default function NewReservationScreen() {
  const router = useRouter();
  const { create, isLoading } = useReservations();
  const { availableRooms } = useRoomAvailability();

  const [roomId, setRoomId] = useState('');
  const [date, setDate] = useState(getTodayString());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [sector, setSector] = useState(SECTORS[0]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = async () => {
    if (!roomId || !title.trim()) {
      Alert.alert('Erro', 'Por favor, selecione uma sala e preencha o título');
      return;
    }

    try {
      await create({
        roomId,
        date,
        startTime,
        endTime,
        sector,
        title: title.trim(),
        description: description.trim() || undefined,
      });

      Alert.alert('Sucesso', 'Reserva criada com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao criar reserva');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Sala</Text>
        <RoomSelector rooms={availableRooms} selectedRoomId={roomId} onSelectRoom={setRoomId} />

        <Text style={styles.sectionTitle}>Data e Horário</Text>
        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data (AAAA-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="2025-10-25"
              placeholderTextColor={COLORS.mutedForeground}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Início (HH:mm)</Text>
            <TextInput
              style={styles.input}
              value={startTime}
              onChangeText={setStartTime}
              placeholder="09:00"
              placeholderTextColor={COLORS.mutedForeground}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Término (HH:mm)</Text>
            <TextInput
              style={styles.input}
              value={endTime}
              onChangeText={setEndTime}
              placeholder="10:00"
              placeholderTextColor={COLORS.mutedForeground}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Detalhes</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Setor</Text>
          <TextInput
            style={styles.input}
            value={sector}
            onChangeText={setSector}
            placeholder="Setor"
            placeholderTextColor={COLORS.mutedForeground}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Ex: Reunião de Planejamento"
            placeholderTextColor={COLORS.mutedForeground}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descrição (opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Descreva o objetivo da reunião..."
            placeholderTextColor={COLORS.mutedForeground}
            multiline
            numberOfLines={4}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonTextSecondary}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary, isLoading && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.foreground} />
          ) : (
            <Text style={styles.buttonTextPrimary}>Criar Reserva</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.foreground,
    marginTop: 20,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    flex: 1,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.foreground,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.foreground,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonSecondary: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonTextPrimary: {
    color: COLORS.foreground,
    fontSize: 16,
    fontWeight: '700',
  },
  buttonTextSecondary: {
    color: COLORS.foreground,
    fontSize: 16,
    fontWeight: '600',
  },
});
