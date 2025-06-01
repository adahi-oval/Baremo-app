import { Schema } from 'mongoose';
import { Publication, IPublication } from '../Publication';

export interface ISexenio extends IPublication {
  active: boolean;
}

const sexenioSchema = new Schema<ISexenio>({
  active: {
    type: Boolean,
    required: true,
    default: undefined,
  },
});

export const Sexenio = Publication.discriminator<ISexenio>('Sexenio', sexenioSchema);
