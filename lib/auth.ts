import api from './api';
import axios from 'axios';

// Define the shape of the arguments for the signIn function
interface SignInCredentials {
  email: string;
  password: string;
}

// Define the shape of the successful response
interface AuthResponse {
  message: string;
  token: string;
}

/**
 * Authenticates the user with the provided credentials.
 * @param credentials - The user's email and password.
 * @returns The authentication response including the token.
 * @throws Will throw an error if authentication fails.
 */
export async function signIn({ email, password }: SignInCredentials): Promise<AuthResponse> {
  try {
    const response = await api.post<AuthResponse>('/api/user/login', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    // Log the error and re-throw it to be handled by the calling function
    console.error('Authentication failed:', error);
    if (axios.isAxiosError(error) && error.response) {
      // Throw a new error with a more specific message from the server if available
      throw new Error(error.response.data.message || 'Invalid credentials');
    }
    // Throw a generic error if the response is not available
    throw new Error('An unexpected error occurred during login.');
  }
}
