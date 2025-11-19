import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Se estiver no Emulador Android: 10.0.2.2
// Se estiver no iPhone físico: Coloque o IP da sua máquina (ex: 192.168.1.15)
const API_URL = Platform.select({
  android: 'http://10.1.2.82:3333', 
  ios: 'http://localhost:3333',
  default: 'http://10.1.2.82:3333', // <--- Ajuste seu IP aqui se necessário
});

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (error) {
    console.error('Erro token', error);
  }
  return config;
});