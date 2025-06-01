import { Schema } from 'mongoose';
import { Publication, IPublication } from '../Publication';

export interface ICaptacion extends IPublication {
  captacionType: "excelencia caixa" | "viera y clavijo senior" | "excelencia fundaciones" | "viera y clavijo junior" | "agustin de betancourt" | "n/a";
}

const captacionSchema = new Schema<ICaptacion>({
  captacionType: {
    type: String,
    required: true,
    enum: [
      "excelencia caixa",
      "viera y clavijo senior",
      "excelencia fundaciones",
      "viera y clavijo junior",
      "agustin de betancourt",
      "n/a"
    ],
    default: "n/a",
  },
});

export const Captacion = Publication.discriminator<ICaptacion>('Captacion', captacionSchema);
