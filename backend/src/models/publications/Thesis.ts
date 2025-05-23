import { Schema } from 'mongoose';
import { Publication } from '../Publication';

export const Thesis = Publication.discriminator('Thesis', new Schema({
  thesisType: { type: String, required: true, enum: ['industrial codirection', 'international mention', 'fpu/fpi o similar', 'other', 'n/a'], default: 'n/a' },
}));