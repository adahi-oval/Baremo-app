import { Schema } from 'mongoose';
import { Publication, IPublication } from '../Publication';

export interface ICatedra extends IPublication {
  catedraType: "direccion" | "subdireccion" | "n/a";
}

const catedraSchema = new Schema<ICatedra>({
  catedraType: {
    type: String,
    required: true,
    enum: [
      "direccion",
      "subdireccion",
      "n/a"
    ],
    default: "n/a",
  },
});

export const Captacion = Publication.discriminator<ICatedra>('Captacion', catedraSchema);
