import api from './api';
import { getToken } from './session';

export interface ClinicProfile {
  id: string;
  name: string;
  email: string;
  address: string;
  // Add other clinic-specific fields here
}

export async function getClinicProfile(): Promise<ClinicProfile> {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('No authentication token found.');
    }

    const response = await api.get<ClinicProfile>('/api/clinic/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch clinic profile:', error);
    throw error;
  }
}