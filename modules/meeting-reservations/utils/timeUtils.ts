import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

// Extende dayjs com plugins
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

/**
 * Verifica se uma hora está dentro do horário comercial (08:00 - 17:30)
 */
export function isWithinBusinessHours(time: string): boolean {
  const timeObj = dayjs(time, 'HH:mm');
  const start = dayjs('08:00', 'HH:mm');
  const end = dayjs('17:30', 'HH:mm');

  return timeObj.isSameOrAfter(start) && timeObj.isSameOrBefore(end);
}

/**
 * Verifica se startTime é antes de endTime
 */
export function isStartBeforeEnd(startTime: string, endTime: string): boolean {
  const start = dayjs(startTime, 'HH:mm');
  const end = dayjs(endTime, 'HH:mm');

  return start.isBefore(end);
}

/**
 * Verifica se uma data é futura (não permite agendar no passado)
 */
export function isFutureDate(date: string): boolean {
  const selectedDate = dayjs(date, 'YYYY-MM-DD');
  const today = dayjs().startOf('day');

  return selectedDate.isSameOrAfter(today);
}

/**
 * Verifica se um horário é futuro (para hoje)
 */
export function isFutureTime(date: string, time: string): boolean {
  const datetime = dayjs(`${date} ${time}`, 'YYYY-MM-DD HH:mm');
  const now = dayjs();

  return datetime.isAfter(now);
}

/**
 * Formata data para exibição (DD/MM/YYYY)
 */
export function formatDate(date: string): string {
  return dayjs(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
}

/**
 * Formata hora para exibição (HH:mm)
 */
export function formatTime(time: string): string {
  return dayjs(time, 'HH:mm').format('HH:mm');
}

/**
 * Retorna a data/hora atual no formato ISO
 */
export function now(): string {
  return dayjs().toISOString();
}

/**
 * Formata datetime para exibição completa (DD/MM/YYYY às HH:mm)
 */
export function formatDateTime(date: string, time: string): string {
  return `${formatDate(date)} às ${formatTime(time)}`;
}

/**
 * Calcula duração em minutos entre dois horários
 */
export function getDurationInMinutes(startTime: string, endTime: string): number {
  const start = dayjs(startTime, 'HH:mm');
  const end = dayjs(endTime, 'HH:mm');

  return end.diff(start, 'minute');
}

/**
 * Verifica se deve enviar lembrete (30 minutos antes)
 */
export function shouldSendReminder(date: string, startTime: string): boolean {
  const reservationStart = dayjs(`${date} ${startTime}`, 'YYYY-MM-DD HH:mm');
  const now = dayjs();
  const thirtyMinutesBefore = reservationStart.subtract(30, 'minute');

  return now.isSameOrAfter(thirtyMinutesBefore) && now.isBefore(reservationStart);
}

/**
 * Retorna data de hoje no formato YYYY-MM-DD
 */
export function getTodayString(): string {
  return dayjs().format('YYYY-MM-DD');
}

/**
 * Retorna hora atual no formato HH:mm
 */
export function getCurrentTimeString(): string {
  return dayjs().format('HH:mm');
}

/**
 * Adiciona dias a uma data
 */
export function addDays(date: string, days: number): string {
  return dayjs(date, 'YYYY-MM-DD').add(days, 'day').format('YYYY-MM-DD');
}

/**
 * Verifica se uma data é fim de semana
 */
export function isWeekend(date: string): boolean {
  const day = dayjs(date, 'YYYY-MM-DD').day();
  return day === 0 || day === 6; // 0 = Domingo, 6 = Sábado
}
