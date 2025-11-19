import api from './api';
import { getToken } from './session';

export interface ProfessionalProfile {
  id: string;
  name: string;
  email: string;
  specialty: string;
  // Add other professional-specific fields here
}

export async function getProfessionalProfile(): Promise<ProfessionalProfile> {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('No authentication token found.');
    }

    const response = await api.get<ProfessionalProfile>('/api/professional/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch professional profile:', error);
    throw error;
  }
}