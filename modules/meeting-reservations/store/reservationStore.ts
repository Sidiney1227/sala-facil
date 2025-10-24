import { create } from 'zustand';
import { Reservation, CreateReservationDTO, UpdateReservationDTO } from '../models/Reservation';
import { reservationMockService } from '../services/reservationMockService';

interface ReservationStore {
  reservations: Reservation[];
  isLoading: boolean;
  error: string | null;
  selectedReservation: Reservation | null;

  // Actions
  loadReservations: () => Promise<void>;
  createReservation: (data: CreateReservationDTO, userId: string, userName: string) => Promise<Reservation>;
  updateReservation: (id: string, data: UpdateReservationDTO, userId: string) => Promise<Reservation>;
  cancelReservation: (id: string, userId: string, userRole: string) => Promise<Reservation>;
  selectReservation: (id: string) => Promise<void>;
  clearSelectedReservation: () => void;
  clearError: () => void;
  refreshReservations: () => Promise<void>;
}

export const useReservationStore = create<ReservationStore>((set, get) => ({
  reservations: [],
  isLoading: false,
  error: null,
  selectedReservation: null,

  loadReservations: async () => {
    set({ isLoading: true, error: null });
    try {
      const reservations = await reservationMockService.getAll();
      set({ reservations, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao carregar reservas',
        isLoading: false,
      });
    }
  },

  createReservation: async (data, userId, userName) => {
    set({ isLoading: true, error: null });
    try {
      const newReservation = await reservationMockService.create(data, userId, userName);

      // Adiciona à lista local
      set((state) => ({
        reservations: [...state.reservations, newReservation],
        isLoading: false,
      }));

      return newReservation;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao criar reserva',
        isLoading: false,
      });
      throw error;
    }
  },

  updateReservation: async (id, data, userId) => {
    set({ isLoading: true, error: null });
    try {
      const updatedReservation = await reservationMockService.update(id, data, userId);

      // Atualiza na lista local
      set((state) => ({
        reservations: state.reservations.map((r) => (r.id === id ? updatedReservation : r)),
        selectedReservation:
          state.selectedReservation?.id === id ? updatedReservation : state.selectedReservation,
        isLoading: false,
      }));

      return updatedReservation;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao atualizar reserva',
        isLoading: false,
      });
      throw error;
    }
  },

  cancelReservation: async (id, userId, userRole) => {
    set({ isLoading: true, error: null });
    try {
      const cancelledReservation = await reservationMockService.cancel(id, userId, userRole);

      // Atualiza na lista local
      set((state) => ({
        reservations: state.reservations.map((r) => (r.id === id ? cancelledReservation : r)),
        selectedReservation:
          state.selectedReservation?.id === id ? cancelledReservation : state.selectedReservation,
        isLoading: false,
      }));

      return cancelledReservation;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao cancelar reserva',
        isLoading: false,
      });
      throw error;
    }
  },

  selectReservation: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const reservation = await reservationMockService.getById(id);

      if (!reservation) {
        throw new Error('Reserva não encontrada');
      }

      set({ selectedReservation: reservation, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Erro ao carregar reserva',
        isLoading: false,
      });
    }
  },

  clearSelectedReservation: () => {
    set({ selectedReservation: null });
  },

  clearError: () => {
    set({ error: null });
  },

  refreshReservations: async () => {
    // Recarrega as reservas sem mostrar loading
    try {
      const reservations = await reservationMockService.getAll();
      set({ reservations });
    } catch (error) {
      console.error('Erro ao atualizar reservas:', error);
    }
  },
}));
