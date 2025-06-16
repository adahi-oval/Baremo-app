import api from "./axios";

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/me');
    if (response.status === 200) {
      return response.data.user;
    } else {
      return response.data.error;
    }
  } catch (err) {
    throw new Error('Not authenticated');
  }
};

export const loginUser = async (email: string, password: string) => {
  const response = await api.post('/login', { email, password });
  if (response.data.error) {
    throw new Error('Invalid credentials.')
  } else {
    return response.data;
  }
};

export const logout = async () => {
  await api.post('/logout');
};

