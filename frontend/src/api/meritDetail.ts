import api from "./axios";
import type { Merit } from "./merits";

export async function getMeritById(id: string): Promise<Merit> {
    const res = await api.get(`/merit/${id}`);

    if (res.status != 200) { throw new Error(res.data.error) };

    return res.data.merit;
}

export async function updateMerit(id: string, updates: any): Promise<string> {
    const res = await api.put(`/merits/${id}`, {updates});

    if (res.status != 200) { throw new Error(res.data.error) };

    return res.data.message;
}