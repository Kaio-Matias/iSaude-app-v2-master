// lib/session.web.ts
// Web-specific implementation using localStorage

const TOKEN_KEY = 'authToken';

export const setToken = async (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = async () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const clearToken = async () => {
  localStorage.removeItem(TOKEN_KEY);
};