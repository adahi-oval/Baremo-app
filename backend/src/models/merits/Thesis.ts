import { Schema } from 'mongoose';
import { Publication, IPublication } from '../Publication';

export interface IThesis extends IPublication {
  thesisType: 'industrial codirection' | 'international mention' | 'fpu/fpi o similar' | 'other' | 'n/a';
}

const thesisSchema = new Schema<IThesis>({
  thesisType: {
    type: String,
    required: true,
    enum: ['industrial codirection', 'international mention', 'fpu/fpi o similar', 'other', 'n/a'],
    default: 'n/a',
  },
});

export const Thesis = Publication.discriminator<IThesis>('Thesis', thesisSchema);
