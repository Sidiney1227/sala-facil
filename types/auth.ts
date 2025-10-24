export type UserRole = 'ADMIN' | 'USER' | 'PORTARIA';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  sector?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
