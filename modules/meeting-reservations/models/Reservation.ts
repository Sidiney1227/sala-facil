export type ReservationStatus = 'Agendado' | 'Em andamento' | 'Realizado' | 'Cancelado';

export interface Reservation {
  id: string;
  roomId: string;
  roomName: string;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  userId: string;
  userName: string;
  sector: string;
  title: string;
  description?: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationDTO {
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  sector: string;
  title: string;
  description?: string;
}

export interface UpdateReservationDTO {
  date?: string;
  startTime?: string;
  endTime?: string;
  sector?: string;
  title?: string;
  description?: string;
}
