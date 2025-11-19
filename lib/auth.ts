import { api } from './api';
import * as SecureStore from 'expo-secure-store';

interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

export async function signIn(email: string, password: string): Promise<LoginResponse> {
  try {
    // Rota mapeada no BFF que redireciona para o serviço de usuários
    const response = await api.post('/api/user/login', {
      email,
      password, // O backend espera 'password' ou 'senha'? Verifiquei UsersAPI.ts: espera { email, password }
    });

    const { user, token } = response.data;

    // Salva o token e dados básicos do usuário
    await SecureStore.setItemAsync('userToken', token);
    await SecureStore.setItemAsync('userData', JSON.stringify(user));

    return { user, token };
  } catch (error: any) {
    console.error('Erro no login:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'Falha ao realizar login.');
  }
}

export async function signOut() {
  await SecureStore.deleteItemAsync('userToken');
  await SecureStore.deleteItemAsync('userData');
}

export async function getUserData() {
  const data = await SecureStore.getItemAsync('userData');
  return data ? JSON.parse(data) : null;
}