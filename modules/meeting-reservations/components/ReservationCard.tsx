import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Clock, User, Building2 } from 'lucide-react-native';
import { Reservation } from '../models/Reservation';
import { StatusBadge } from './StatusBadge';
import { formatDate, formatTime } from '../utils/timeUtils';
import { COLORS } from '../../../constants/colors';

interface ReservationCardProps {
  reservation: Reservation;
}

export function ReservationCard({ reservation }: ReservationCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/reservations/${reservation.id}` as any);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title} numberOfLines={1}>
            {reservation.title}
          </Text>
          <Text style={styles.room}>{reservation.roomName}</Text>
        </View>
        <StatusBadge status={reservation.status} size="small" />
      </View>

      <View style={styles.divider} />

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <View style={styles.detailLabelContainer}>
            <Calendar size={16} color={COLORS.mutedForeground} />
            <Text style={styles.detailLabel}>Data:</Text>
          </View>
          <Text style={styles.detailValue}>{formatDate(reservation.date)}</Text>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailLabelContainer}>
            <Clock size={16} color={COLORS.mutedForeground} />
            <Text style={styles.detailLabel}>Horário:</Text>
          </View>
          <Text style={styles.detailValue}>
            {formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailLabelContainer}>
            <User size={16} color={COLORS.mutedForeground} />
            <Text style={styles.detailLabel}>Responsável:</Text>
          </View>
          <Text style={styles.detailValue} numberOfLines={1}>
            {reservation.userName}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailLabelContainer}>
            <Building2 size={16} color={COLORS.mutedForeground} />
            <Text style={styles.detailLabel}>Setor:</Text>
          </View>
          <Text style={styles.detailValue}>{reservation.sector}</Text>
        </View>
      </View>

      {reservation.description && (
        <>
          <View style={styles.divider} />
          <Text style={styles.description} numberOfLines={2}>
            {reservation.description}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.foreground,
    marginBottom: 4,
  },
  room: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  details: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.mutedForeground,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.foreground,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  description: {
    fontSize: 13,
    color: COLORS.mutedForeground,
    fontStyle: 'italic',
  },
});
