import { useEffect } from 'react';
import { useReservationStore } from '../store/reservationStore';
import { useAuth } from '../../../context/AuthContext';

/**
 * Hook customizado para gerenciamento de reservas
 * Fornece acesso fácil ao store e ações de reservas
 */
export function useReservations() {
  const { user } = useAuth();
  const {
    reservations,
    isLoading,
    error,
    selectedReservation,
    loadReservations,
    createReservation,
    updateReservation,
    cancelReservation,
    selectReservation,
    clearSelectedReservation,
    clearError,
    refreshReservations,
  } = useReservationStore();

  // Carrega reservas ao montar o componente
  useEffect(() => {
    loadReservations();
  }, []);

  // Funções auxiliares que incluem dados do usuário automaticamente
  const create = async (data: Parameters<typeof createReservation>[0]) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    return createReservation(data, user.id, user.name);
  };

  const update = async (id: string, data: Parameters<typeof updateReservation>[1]) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    return updateReservation(id, data, user.id);
  };

  const cancel = async (id: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }
    return cancelReservation(id, user.id, user.role);
  };

  // Filtros úteis
  const myReservations = reservations.filter((r) => r.userId === user?.id);
  const upcomingReservations = reservations.filter(
    (r) => r.status === 'Agendado' || r.status === 'Em andamento'
  );
  const pastReservations = reservations.filter(
    (r) => r.status === 'Realizado' || r.status === 'Cancelado'
  );

  return {
    // Estado
    reservations,
    myReservations,
    upcomingReservations,
    pastReservations,
    isLoading,
    error,
    selectedReservation,

    // Ações
    create,
    update,
    cancel,
    selectReservation,
    clearSelectedReservation,
    clearError,
    refreshReservations,
    loadReservations,
  };
}
