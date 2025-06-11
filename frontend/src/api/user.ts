import api from './axios';

export interface IUser {
    _id: string;
    username: string;
    fullName: string;
    email: string;
    researcherId: string;
    institutes: string[];
}

export const loginUser = async (username: string, password: string) => {
  const res = await api.post('/login', { username, password });
  return res.data;
};

export async function getAllUsers(): Promise<IUser[]> {
  const res = await api.get('/users');
  return res.data.users;
};
