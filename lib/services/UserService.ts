import api from '../api';

export const UserService = {
  getUsers: async () => {
    try {
      // Assuming a /users endpoint exists on the API
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  // Add other user-related API calls here (e.g., createUser, getUserById, etc.)
};
