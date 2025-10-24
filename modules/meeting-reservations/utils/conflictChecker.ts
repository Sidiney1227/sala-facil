import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import { Reservation } from '../models/Reservation';

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

/**
 * Verifica se dois intervalos de tempo se sobrepõem
 *
 * Exemplo de sobreposição:
 * Reserva A: 10:00 - 11:00
 * Reserva B: 10:30 - 11:30  ✗ Conflito!
 *
 * Não há sobreposição:
 * Reserva A: 10:00 - 11:00
 * Reserva B: 11:00 - 12:00  ✓ OK (horários exatos são permitidos)
 */
function timeRangesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const s1 = dayjs(start1, 'HH:mm');
  const e1 = dayjs(end1, 'HH:mm');
  const s2 = dayjs(start2, 'HH:mm');
  const e2 = dayjs(end2, 'HH:mm');

  // Verifica se há sobreposição (excluindo limites exatos)
  return (
    (s1.isBefore(e2) && e1.isAfter(s2)) || // s1 < e2 && e1 > s2
    (s2.isBefore(e1) && e2.isAfter(s1))    // s2 < e1 && e2 > s1
  );
}

/**
 * Verifica se uma nova reserva tem conflito com reservas existentes
 *
 * @param roomId - ID da sala
 * @param date - Data da reserva (YYYY-MM-DD)
 * @param startTime - Horário de início (HH:mm)
 * @param endTime - Horário de término (HH:mm)
 * @param existingReservations - Lista de reservas existentes
 * @param excludeId - ID de reserva a ser excluído da verificação (útil para edição)
 * @returns true se houver conflito, false caso contrário
 */
export function hasConflict(
  roomId: string,
  date: string,
  startTime: string,
  endTime: string,
  existingReservations: Reservation[],
  excludeId?: string
): boolean {
  // Filtra reservas da mesma sala, mesma data, e que não estão canceladas
  const relevantReservations = existingReservations.filter(
    (reservation) =>
      reservation.roomId === roomId &&
      reservation.date === date &&
      reservation.status !== 'Cancelado' &&
      reservation.id !== excludeId // Exclui a própria reserva (para edição)
  );

  // Verifica se alguma reserva tem conflito de horário
  return relevantReservations.some((reservation) =>
    timeRangesOverlap(startTime, endTime, reservation.startTime, reservation.endTime)
  );
}

/**
 * Encontra todas as reservas com conflito para uma nova reserva
 *
 * Útil para exibir quais reservas estão em conflito
 */
export function findConflictingReservations(
  roomId: string,
  date: string,
  startTime: string,
  endTime: string,
  existingReservations: Reservation[],
  excludeId?: string
): Reservation[] {
  return existingReservations.filter(
    (reservation) =>
      reservation.roomId === roomId &&
      reservation.date === date &&
      reservation.status !== 'Cancelado' &&
      reservation.id !== excludeId &&
      timeRangesOverlap(startTime, endTime, reservation.startTime, reservation.endTime)
  );
}

/**
 * Retorna os horários disponíveis para uma sala em uma data específica
 *
 * @param roomId - ID da sala
 * @param date - Data (YYYY-MM-DD)
 * @param existingReservations - Reservas existentes
 * @param timeSlots - Lista de horários possíveis (ex: ['08:00', '08:30', ...])
 * @returns Array de horários disponíveis
 */
export function getAvailableTimeSlots(
  roomId: string,
  date: string,
  existingReservations: Reservation[],
  timeSlots: string[]
): string[] {
  const relevantReservations = existingReservations.filter(
    (reservation) =>
      reservation.roomId === roomId &&
      reservation.date === date &&
      reservation.status !== 'Cancelado'
  );

  // Se não há reservas, todos os horários estão disponíveis
  if (relevantReservations.length === 0) {
    return timeSlots;
  }

  // Filtra horários que não conflitam com reservas existentes
  return timeSlots.filter((slot) => {
    const slotTime = dayjs(slot, 'HH:mm');

    // Verifica se o horário está dentro de alguma reserva
    const isOccupied = relevantReservations.some((reservation) => {
      const start = dayjs(reservation.startTime, 'HH:mm');
      const end = dayjs(reservation.endTime, 'HH:mm');

      return slotTime.isBetween(start, end, null, '[)'); // [) = inclui início, exclui fim
    });

    return !isOccupied;
  });
}
