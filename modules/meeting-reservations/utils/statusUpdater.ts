import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import { Reservation, ReservationStatus } from '../models/Reservation';

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

/**
 * Determina o status atual de uma reserva baseado na data e horário
 *
 * Lógica:
 * - Agendado: horário de início é futuro
 * - Em andamento: horário atual está entre início e fim
 * - Realizado: horário de término já passou
 * - Cancelado: status manual, não muda automaticamente
 */
export function getReservationStatus(
  date: string,
  startTime: string,
  endTime: string,
  currentStatus: ReservationStatus
): ReservationStatus {
  // Se já está cancelado, mantém cancelado
  if (currentStatus === 'Cancelado') {
    return 'Cancelado';
  }

  const now = dayjs();
  const reservationStart = dayjs(`${date} ${startTime}`, 'YYYY-MM-DD HH:mm');
  const reservationEnd = dayjs(`${date} ${endTime}`, 'YYYY-MM-DD HH:mm');

  // Verifica se a reunião já terminou
  if (now.isAfter(reservationEnd)) {
    return 'Realizado';
  }

  // Verifica se a reunião está em andamento
  if (now.isBetween(reservationStart, reservationEnd, null, '[]')) {
    return 'Em andamento';
  }

  // Caso contrário, está agendada para o futuro
  return 'Agendado';
}

/**
 * Atualiza o status de uma reserva
 */
export function updateReservationStatus(reservation: Reservation): Reservation {
  const newStatus = getReservationStatus(
    reservation.date,
    reservation.startTime,
    reservation.endTime,
    reservation.status
  );

  if (newStatus !== reservation.status) {
    return {
      ...reservation,
      status: newStatus,
      updatedAt: dayjs().toISOString(),
    };
  }

  return reservation;
}

/**
 * Atualiza o status de múltiplas reservas
 */
export function updateReservationsStatus(reservations: Reservation[]): Reservation[] {
  return reservations.map(updateReservationStatus);
}

/**
 * Verifica se uma reserva pode ser editada (apenas "Agendado" pode ser editado)
 */
export function canEditReservation(status: ReservationStatus): boolean {
  return status === 'Agendado';
}

/**
 * Verifica se uma reserva pode ser cancelada (não pode cancelar "Realizado" ou já "Cancelado")
 */
export function canCancelReservation(status: ReservationStatus): boolean {
  return status === 'Agendado' || status === 'Em andamento';
}
