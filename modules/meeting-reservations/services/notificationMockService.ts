import { Reservation } from '../models/Reservation';
import { formatDateTime } from '../utils/timeUtils';

/**
 * Mock service para notificações por email
 * Em produção, isso seria substituído por um serviço real de envio de emails
 */
class NotificationMockService {
  /**
   * Envia email de confirmação de reserva
   */
  async sendConfirmation(reservation: Reservation): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    console.log('📧 [MOCK EMAIL] Confirmação de Reserva');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Para: ${reservation.userName} (${reservation.userId})`);
    console.log('Assunto: Confirmação de Reserva de Sala');
    console.log('');
    console.log('Olá! Sua reserva foi confirmada com sucesso.');
    console.log('');
    console.log('📋 Detalhes da Reserva:');
    console.log(`   • Sala: ${reservation.roomName}`);
    console.log(`   • Data/Hora: ${formatDateTime(reservation.date, reservation.startTime)}`);
    console.log(`   • Término: ${reservation.endTime}`);
    console.log(`   • Título: ${reservation.title}`);
    if (reservation.description) {
      console.log(`   • Descrição: ${reservation.description}`);
    }
    console.log(`   • Setor: ${reservation.sector}`);
    console.log('');
    console.log('Um lembrete será enviado 30 minutos antes do horário.');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }

  /**
   * Envia email de lembrete 30 minutos antes
   */
  async sendReminder(reservation: Reservation): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    console.log('⏰ [MOCK EMAIL] Lembrete de Reunião');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Para: ${reservation.userName} (${reservation.userId})`);
    console.log('Assunto: Lembrete: Sua reunião começa em 30 minutos');
    console.log('');
    console.log('⏰ Sua reunião começa em 30 minutos!');
    console.log('');
    console.log('📋 Detalhes:');
    console.log(`   • Sala: ${reservation.roomName}`);
    console.log(`   • Horário: ${reservation.startTime} - ${reservation.endTime}`);
    console.log(`   • Título: ${reservation.title}`);
    console.log('');
    console.log('Não se esqueça de comparecer!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }

  /**
   * Envia email de cancelamento
   */
  async sendCancellation(reservation: Reservation): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    console.log('❌ [MOCK EMAIL] Cancelamento de Reserva');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Para: ${reservation.userName} (${reservation.userId})`);
    console.log('Assunto: Reserva Cancelada');
    console.log('');
    console.log('Sua reserva foi cancelada.');
    console.log('');
    console.log('📋 Reserva Cancelada:');
    console.log(`   • Sala: ${reservation.roomName}`);
    console.log(`   • Data/Hora: ${formatDateTime(reservation.date, reservation.startTime)}`);
    console.log(`   • Título: ${reservation.title}`);
    console.log('');
    console.log('Se você não solicitou este cancelamento, entre em contato com o administrador.');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }
}

export const notificationMockService = new NotificationMockService();
