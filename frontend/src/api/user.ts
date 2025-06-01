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

export const getAllUsers = async () => {
  const res = await api.get('/users');
  return res.data.users;
};
