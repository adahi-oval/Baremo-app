import { Schema } from 'mongoose';
import { Publication, IPublication } from '../Publication';

export interface ITransference extends IPublication {
  transferenceType:
    | "patente en explotacion de la ull"
    | "patente en explotacion con otra entidad vinculada"
    | "patentes no explotadas por la ull"
    | "empresa spin-off ull"
    | "elaboracion de informes"
    | "propiedad intelectual"
    | "convenios de colaboracion"
    | "n/a";
}

const transferenceSchema = new Schema<ITransference>({
  transferenceType: {
    type: String,
    required: true,
    enum: [
      "patente en explotacion de la ull",
      "patente en explotacion con otra entidad vinculada",
      "patentes no explotadas por la ull",
      "empresa spin-off ull",
      "elaboracion de informes",
      "propiedad intelectual",
      "convenios de colaboracion",
      "n/a",
    ],
    default: "n/a",
  },
});

export const Transference = Publication.discriminator<ITransference>('Transference', transferenceSchema);
