import api from './axios';

export interface IUser {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  researcherId: string;
  institutes: string[];
  totalScore?: number | undefined;
  averageScore?: number | undefined;
}

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
