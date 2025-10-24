import { useMemo } from 'react';
import { useReservationStore } from '../store/reservationStore';
import { ROOMS } from '../constants/rooms';
import { TIME_SLOTS } from '../constants/timeSlots';
import { hasConflict, getAvailableTimeSlots } from '../utils/conflictChecker';

/**
 * Hook para verificar disponibilidade de salas e horários
 */
export function useRoomAvailability(date?: string, startTime?: string, endTime?: string) {
  const { reservations } = useReservationStore();

  /**
   * Retorna todas as salas disponíveis
   */
  const availableRooms = useMemo(() => {
    return ROOMS.filter((room) => room.isAvailable);
  }, []);

  /**
   * Verifica se uma sala específica está disponível no horário selecionado
   */
  const isRoomAvailable = useMemo(() => {
    if (!date || !startTime || !endTime) return {};

    const availability: Record<string, boolean> = {};

    ROOMS.forEach((room) => {
      availability[room.id] = !hasConflict(room.id, date, startTime, endTime, reservations);
    });

    return availability;
  }, [date, startTime, endTime, reservations]);

  /**
   * Retorna salas disponíveis para o horário selecionado
   */
  const availableRoomsForTime = useMemo(() => {
    if (!date || !startTime || !endTime) return availableRooms;

    return availableRooms.filter((room) => {
      return !hasConflict(room.id, date, startTime, endTime, reservations);
    });
  }, [date, startTime, endTime, reservations, availableRooms]);

  /**
   * Retorna horários disponíveis para uma sala específica em uma data
   */
  const getAvailableTimeSlotsForRoom = (roomId: string, selectedDate: string) => {
    return getAvailableTimeSlots(roomId, selectedDate, reservations, TIME_SLOTS);
  };

  /**
   * Verifica se há conflito para uma reserva específica
   */
  const checkConflict = (roomId: string, selectedDate: string, start: string, end: string, excludeId?: string) => {
    return hasConflict(roomId, selectedDate, start, end, reservations, excludeId);
  };

  return {
    availableRooms,
    isRoomAvailable,
    availableRoomsForTime,
    getAvailableTimeSlotsForRoom,
    checkConflict,
  };
}
