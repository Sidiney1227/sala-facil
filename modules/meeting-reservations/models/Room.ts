export interface Room {
  id: string;
  name: string;
  capacity: number;
  floor: number;
  features: string[];
  isAvailable: boolean;
}
