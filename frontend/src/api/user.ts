import type { User } from '../components/AuthContext';
import api from './axios';

export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  researcherId: string;
  institutes: string[];
  totalScore?: number | undefined;
  averageScore?: number | undefined;
  role?: "user" | "admin";
}

export interface UserUpdates {
  fullName?: string;
  email?: string;
  password?: string;
  role?: 'user' | 'admin';
  institutes?: string[];
}

export type Role = 'admin' | 'user';

export const loginUser = async (username: string, password: string) => {
  const res = await api.post('/login', { username, password });
  return res.data;
};

export async function getUser(researcherId: number): Promise<IUser> {
  const res = await api.get(`/user/${researcherId}`);

  const user: IUser = { ...res.data.user, totalScore: res.data.userScore }

  return user;
}

export async function getAllUsers(): Promise<IUser[]> {
  const res = await api.get('/users');
  return res.data.users;
};

export async function getAllUsersByInstitute(researcherId: number): Promise<IUser[]> {
  const res = await api.get(`users/${researcherId}/institute`);
  return res.data.users;
};

export async function getAllUsersScored(): Promise<IUser[]> {
  const res = await api.get('/users/score');

  const users = await Promise.all(
    res.data.users.map(async (user: IUser) => {
      if (user.totalScore !== undefined && user.totalScore < 8) {
        const avgScoreRes = await api.get(`/user/${user.researcherId}/score/average`);
        return { ...user, averageScore: avgScoreRes.data.averageScore };
      }
      return user;
    })
  );

  return users;
}

export async function getAllUsersScoredByInstitute(researcherId: number): Promise<IUser[]> {
  const res = await api.get(`/users/score/${researcherId}`);

  const users = await Promise.all(
    res.data.users.map(async (user: IUser) => {
      if (user.totalScore !== undefined && user.totalScore < 8) {
        const avgScoreRes = await api.get(`/user/${user.researcherId}/score/average`);
        return { ...user, averageScore: avgScoreRes.data.averageScore };
      }
      return user;
    })
  );

  return users;
}

export async function createUser(user: User): Promise<string> {
  const res = await api.post('/user', { user: user });

  return res.status === 201 ? res.data.id : `Error: ${res.data.error}`
}

export async function updateUser(researcherId: number, updates: UserUpdates) {
  const res = await api.put(`/user/${researcherId}`, {updates: updates});

  return res.data;
}