import api from './api';
import { getToken } from './session';

export interface PatientProfile {
  id: string;
  name: string;
  email: string;
  // Add other patient-specific fields here
}

export async function getPatientProfile(): Promise<PatientProfile> {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error('No authentication token found.');
    }

    const response = await api.get<PatientProfile>('/api/patient/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch patient profile:', error);
    throw error;
  }
}