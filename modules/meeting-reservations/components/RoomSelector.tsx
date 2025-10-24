import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Users, Layers } from 'lucide-react-native';
import { Room } from '../models/Room';
import { COLORS } from '../../../constants/colors';

interface RoomSelectorProps {
  rooms: Room[];
  selectedRoomId?: string;
  onSelectRoom: (roomId: string) => void;
  unavailableRoomIds?: string[];
}

export function RoomSelector({
  rooms,
  selectedRoomId,
  onSelectRoom,
  unavailableRoomIds = [],
}: RoomSelectorProps) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Selecione uma sala</Text>
      <View style={styles.roomList}>
        {rooms.map((room) => {
          const isSelected = room.id === selectedRoomId;
          const isUnavailable = unavailableRoomIds.includes(room.id);

          return (
            <TouchableOpacity
              key={room.id}
              style={[
                styles.roomCard,
                isSelected && styles.roomCardSelected,
                isUnavailable && styles.roomCardUnavailable,
              ]}
              onPress={() => !isUnavailable && onSelectRoom(room.id)}
              disabled={isUnavailable}
              activeOpacity={0.7}
            >
              <View style={styles.roomHeader}>
                <Text
                  style={[
                    styles.roomName,
                    isSelected && styles.roomNameSelected,
                    isUnavailable && styles.roomNameUnavailable,
                  ]}
                >
                  {room.name}
                </Text>
                {isUnavailable && <Text style={styles.unavailableTag}>Indisponível</Text>}
              </View>

              <View style={styles.roomDetails}>
                <View style={styles.roomInfoRow}>
                  <Users size={16} color={isUnavailable ? COLORS.mutedForeground : isSelected ? COLORS.primary : COLORS.mutedForeground} />
                  <Text
                    style={[
                      styles.roomInfo,
                      isSelected && styles.roomInfoSelected,
                      isUnavailable && styles.roomInfoUnavailable,
                    ]}
                  >
                    Capacidade: {room.capacity} pessoas
                  </Text>
                </View>
                <View style={styles.roomInfoRow}>
                  <Layers size={16} color={isUnavailable ? COLORS.mutedForeground : isSelected ? COLORS.primary : COLORS.mutedForeground} />
                  <Text
                    style={[
                      styles.roomInfo,
                      isSelected && styles.roomInfoSelected,
                      isUnavailable && styles.roomInfoUnavailable,
                    ]}
                  >
                    Andar: {room.floor}
                  </Text>
                </View>
              </View>

              {room.features.length > 0 && (
                <View style={styles.features}>
                  {room.features.map((feature) => (
                    <View key={feature} style={styles.featureBadge}>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.foreground,
    marginBottom: 16,
  },
  roomList: {
    gap: 12,
  },
  roomCard: {
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
  },
  roomCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.card,
  },
  roomCardUnavailable: {
    opacity: 0.5,
    backgroundColor: COLORS.muted,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roomName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.foreground,
    flex: 1,
  },
  roomNameSelected: {
    color: COLORS.primary,
  },
  roomNameUnavailable: {
    color: COLORS.mutedForeground,
  },
  unavailableTag: {
    fontSize: 11,
    color: COLORS.destructive,
    fontWeight: '600',
  },
  roomDetails: {
    gap: 4,
    marginBottom: 8,
  },
  roomInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  roomInfo: {
    fontSize: 14,
    color: COLORS.mutedForeground,
  },
  roomInfoSelected: {
    color: COLORS.foreground,
  },
  roomInfoUnavailable: {
    color: COLORS.mutedForeground,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  featureBadge: {
    backgroundColor: COLORS.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  featureText: {
    fontSize: 11,
    color: COLORS.foreground,
  },
});
