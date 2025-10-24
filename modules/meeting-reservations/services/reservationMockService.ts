import AsyncStorage from '@react-native-async-storage/async-storage';
import { Reservation, CreateReservationDTO, UpdateReservationDTO } from '../models/Reservation';
import { ROOMS } from '../constants/rooms';
import { hasConflict, findConflictingReservations } from '../utils/conflictChecker';
import { updateReservationStatus, canEditReservation } from '../utils/statusUpdater';
import { now, getTodayString, addDays } from '../utils/timeUtils';
import { notificationMockService } from './notificationMockService';

const STORAGE_KEY = '@salafacil:reservations';

/**
 * Mock service para gerenciamento de reservas
 * Simula um backend com AsyncStorage para persistência local
 */
class ReservationMockService {
  /**
   * Carrega todas as reservas do AsyncStorage
   */
  async getAll(): Promise<Reservation[]> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simula delay de rede

      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Se não há dados, retorna array de reservas mock iniciais
        const mockReservations = this.getMockReservations();
        await this.saveToStorage(mockReservations);
        return mockReservations;
      }

      let reservations: Reservation[] = JSON.parse(data);

      // Atualiza status das reservas automaticamente
      reservations = reservations.map(updateReservationStatus);

      // Salva de volta com status atualizado
      await this.saveToStorage(reservations);

      return reservations;
    } catch (error) {
      console.error('Erro ao carregar reservas:', error);
      return [];
    }
  }

  /**
   * Busca uma reserva por ID
   */
  async getById(id: string): Promise<Reservation | null> {
    const reservations = await this.getAll();
    const reservation = reservations.find((r) => r.id === id);
    return reservation || null;
  }

  /**
   * Cria uma nova reserva
   */
  async create(data: CreateReservationDTO, userId: string, userName: string): Promise<Reservation> {
    await new Promise((resolve) => setTimeout(resolve, 700)); // Simula delay de rede

    const reservations = await this.getAll();

    // Verifica conflitos
    if (hasConflict(data.roomId, data.date, data.startTime, data.endTime, reservations)) {
      const conflicts = findConflictingReservations(
        data.roomId,
        data.date,
        data.startTime,
        data.endTime,
        reservations
      );
      throw new Error(
        `Conflito de horário! A sala já está reservada das ${conflicts[0].startTime} às ${conflicts[0].endTime}.`
      );
    }

    // Busca nome da sala
    const room = ROOMS.find((r) => r.id === data.roomId);
    if (!room) {
      throw new Error('Sala não encontrada');
    }

    // Cria nova reserva
    const newReservation: Reservation = {
      id: Date.now().toString(),
      roomId: data.roomId,
      roomName: room.name,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      userId,
      userName,
      sector: data.sector,
      title: data.title,
      description: data.description,
      status: 'Agendado',
      createdAt: now(),
      updatedAt: now(),
    };

    // Atualiza status baseado na data/hora atual
    const updatedReservation = updateReservationStatus(newReservation);

    reservations.push(updatedReservation);
    await this.saveToStorage(reservations);

    // Envia notificação de confirmação
    await notificationMockService.sendConfirmation(updatedReservation);

    return updatedReservation;
  }

  /**
   * Atualiza uma reserva existente
   */
  async update(
    id: string,
    data: UpdateReservationDTO,
    userId: string
  ): Promise<Reservation> {
    await new Promise((resolve) => setTimeout(resolve, 600)); // Simula delay de rede

    const reservations = await this.getAll();
    const index = reservations.findIndex((r) => r.id === id);

    if (index === -1) {
      throw new Error('Reserva não encontrada');
    }

    const existingReservation = reservations[index];

    // Verifica permissão (apenas o criador pode editar)
    if (existingReservation.userId !== userId) {
      throw new Error('Você não tem permissão para editar esta reserva');
    }

    // Verifica se pode editar (apenas "Agendado")
    if (!canEditReservation(existingReservation.status)) {
      throw new Error(`Não é possível editar uma reserva com status "${existingReservation.status}"`);
    }

    // Verifica conflitos (excluindo a própria reserva)
    if (data.date || data.startTime || data.endTime) {
      const newDate = data.date || existingReservation.date;
      const newStartTime = data.startTime || existingReservation.startTime;
      const newEndTime = data.endTime || existingReservation.endTime;

      if (
        hasConflict(
          existingReservation.roomId,
          newDate,
          newStartTime,
          newEndTime,
          reservations,
          id // Exclui a própria reserva
        )
      ) {
        throw new Error('Conflito de horário! Escolha outro horário.');
      }
    }

    // Atualiza reserva
    const updatedReservation: Reservation = {
      ...existingReservation,
      date: data.date || existingReservation.date,
      startTime: data.startTime || existingReservation.startTime,
      endTime: data.endTime || existingReservation.endTime,
      sector: data.sector || existingReservation.sector,
      title: data.title || existingReservation.title,
      description: data.description !== undefined ? data.description : existingReservation.description,
      updatedAt: now(),
    };

    // Atualiza status
    const finalReservation = updateReservationStatus(updatedReservation);

    reservations[index] = finalReservation;
    await this.saveToStorage(reservations);

    return finalReservation;
  }

  /**
   * Cancela uma reserva
   */
  async cancel(id: string, userId: string, userRole: string): Promise<Reservation> {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simula delay de rede

    const reservations = await this.getAll();
    const index = reservations.findIndex((r) => r.id === id);

    if (index === -1) {
      throw new Error('Reserva não encontrada');
    }

    const reservation = reservations[index];

    // Verifica permissões
    // ADMIN e PORTARIA podem cancelar qualquer reserva
    // USER só pode cancelar suas próprias reservas
    const canCancel =
      userRole === 'ADMIN' ||
      userRole === 'PORTARIA' ||
      (userRole === 'USER' && reservation.userId === userId);

    if (!canCancel) {
      throw new Error('Você não tem permissão para cancelar esta reserva');
    }

    if (reservation.status === 'Cancelado') {
      throw new Error('Esta reserva já está cancelada');
    }

    if (reservation.status === 'Realizado') {
      throw new Error('Não é possível cancelar uma reserva já realizada');
    }

    // Cancela reserva
    const cancelledReservation: Reservation = {
      ...reservation,
      status: 'Cancelado',
      updatedAt: now(),
    };

    reservations[index] = cancelledReservation;
    await this.saveToStorage(reservations);

    // Envia notificação de cancelamento
    await notificationMockService.sendCancellation(cancelledReservation);

    return cancelledReservation;
  }

  /**
   * Salva reservas no AsyncStorage
   */
  private async saveToStorage(reservations: Reservation[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
    } catch (error) {
      console.error('Erro ao salvar reservas:', error);
      throw new Error('Erro ao salvar dados');
    }
  }

  /**
   * Retorna reservas mock iniciais para demonstração
   */
  private getMockReservations(): Reservation[] {
    const today = getTodayString();
    const tomorrow = addDays(today, 1);
    const nextWeek = addDays(today, 7);

    return [
      {
        id: '1',
        roomId: '1',
        roomName: 'Sala de Reunião 1',
        date: today,
        startTime: '14:00',
        endTime: '15:00',
        userId: '2',
        userName: 'João Silva',
        sector: 'RH',
        title: 'Reunião de Integração',
        description: 'Integração de novos colaboradores',
        status: 'Agendado',
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: '2',
        roomId: '2',
        roomName: 'Sala de Reunião 2',
        date: tomorrow,
        startTime: '09:00',
        endTime: '10:30',
        userId: '1',
        userName: 'Admin Antonelly',
        sector: 'Administração',
        title: 'Reunião de Planejamento',
        description: 'Planejamento estratégico do trimestre',
        status: 'Agendado',
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: '3',
        roomId: '4',
        roomName: 'Sala de Treinamento',
        date: nextWeek,
        startTime: '13:00',
        endTime: '17:00',
        userId: '2',
        userName: 'João Silva',
        sector: 'RH',
        title: 'Treinamento de Segurança',
        description: 'Treinamento anual de segurança do trabalho',
        status: 'Agendado',
        createdAt: now(),
        updatedAt: now(),
      },
    ];
  }

  /**
   * Reseta todas as reservas (útil para testes)
   */
  async reset(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  }
}

export const reservationMockService = new ReservationMockService();
