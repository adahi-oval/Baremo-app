import api from "./axios";
import type { Merit } from "./merits";

export async function getMeritById(id: string): Promise<Merit> {
    const res = await api.get(`/merit/${id}`);
    if (res.status != 200) throw new Error ("Response was not 200");

    return res.data.merit;
}