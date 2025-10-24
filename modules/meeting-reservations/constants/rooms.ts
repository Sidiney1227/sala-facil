import { Room } from '../models/Room';

export const ROOMS: Room[] = [
  {
    id: '1',
    name: 'Sala de Reunião 1',
    capacity: 8,
    floor: 1,
    features: ['TV', 'Quadro Branco', 'Ar Condicionado'],
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Sala de Reunião 2',
    capacity: 12,
    floor: 1,
    features: ['TV', 'Quadro Branco', 'Ar Condicionado', 'Projetor'],
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Sala de Reunião 3',
    capacity: 6,
    floor: 2,
    features: ['TV', 'Quadro Branco'],
    isAvailable: true,
  },
  {
    id: '4',
    name: 'Sala de Treinamento',
    capacity: 20,
    floor: 2,
    features: ['TV', 'Quadro Branco', 'Ar Condicionado', 'Projetor', 'Som'],
    isAvailable: true,
  },
  {
    id: '5',
    name: 'Sala Executiva',
    capacity: 4,
    floor: 3,
    features: ['TV', 'Mesa de Conferência', 'Ar Condicionado'],
    isAvailable: true,
  },
];
