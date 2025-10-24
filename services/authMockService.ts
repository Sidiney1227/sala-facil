import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginCredentials, User } from '../types/auth';

const STORAGE_KEY = '@salafacil:auth';

// Usuários mock para teste
const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: '1',
    name: 'Admin Antonelly',
    email: 'admin',
    password: 'admin',
    role: 'ADMIN',
    sector: 'Administração',
  },
  {
    id: '2',
    name: 'João Silva',
    email: 'joao@antonelly.com',
    password: 'user123',
    role: 'USER',
    sector: 'RH',
  },
  {
    id: '3',
    name: 'Maria Portaria',
    email: 'portaria@antonelly.com',
    password: 'portaria123',
    role: 'PORTARIA',
    sector: 'Portaria',
  },
];

/**
 * Mock service para autenticação
 * Simula um backend com delay e validação de credenciais
 */
export const authMockService = {
  /**
   * Login com credenciais
   * @param credentials - Email e senha do usuário
   * @returns User e token fake
   */
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    // Simula delay de rede
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = MOCK_USERS.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // Remove password do objeto retornado
    const { password, ...userWithoutPassword } = user;

    // Gera token fake
    const token = `fake-jwt-token-${user.id}-${Date.now()}`;

    // Salva no AsyncStorage
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user: userWithoutPassword, token })
    );

    return { user: userWithoutPassword, token };
  },

  /**
   * Logout do usuário
   */
  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    await AsyncStorage.removeItem(STORAGE_KEY);
  },

  /**
   * Restaura sessão do AsyncStorage
   * Útil para manter usuário logado após fechar o app
   */
  async restoreSession(): Promise<{ user: User; token: string } | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) return null;

      const parsed = JSON.parse(data);

      // Valida estrutura dos dados
      if (!parsed.user || !parsed.token) return null;

      return parsed;
    } catch (error) {
      console.error('Erro ao restaurar sessão:', error);
      return null;
    }
  },

  /**
   * Retorna todos os usuários mock (para fins de debug/teste)
   */
  getMockUsers() {
    return MOCK_USERS.map(({ password, ...user }) => user);
  },
};
