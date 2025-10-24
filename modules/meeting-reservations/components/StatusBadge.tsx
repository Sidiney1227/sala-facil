import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ReservationStatus } from '../models/Reservation';
import { COLORS } from '../../../constants/colors';

interface StatusBadgeProps {
  status: ReservationStatus;
  size?: 'small' | 'medium';
}

export function StatusBadge({ status, size = 'medium' }: StatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'Agendado':
        return COLORS.info; // Azul
      case 'Em andamento':
        return COLORS.warning; // Amarelo
      case 'Realizado':
        return COLORS.success; // Verde
      case 'Cancelado':
        return COLORS.destructive; // Vermelho
      default:
        return COLORS.muted;
    }
  };

  const backgroundColor = getStatusColor();
  const isSmall = size === 'small';

  return (
    <View style={[styles.badge, { backgroundColor }, isSmall && styles.badgeSmall]}>
      <Text style={[styles.text, isSmall && styles.textSmall]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  text: {
    color: COLORS.foreground,
    fontSize: 12,
    fontWeight: '600',
  },
  textSmall: {
    fontSize: 10,
  },
});
