// WARNING: This is not a secure way to store the authentication token.
// It is stored in a global variable and will be lost when the app is closed.
// For a production application, you should use a secure storage solution like expo-secure-store.

let authToken: string | null = null;

export const setToken = (token: string) => {
  authToken = token;
};

export const getToken = () => {
  return authToken;
};

export const clearToken = () => {
  authToken = null;
};
