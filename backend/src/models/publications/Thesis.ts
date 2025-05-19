import { Schema } from 'mongoose';
import { Publication } from '../Publication';

export const Project = Publication.discriminator('Thesis', new Schema({
  type: { type: String, required: true, enum: ['industrial codirection', 'international mention', 'fpu/fpi o similar', 'other', 'n/a'], default: 'n/a' },
}));