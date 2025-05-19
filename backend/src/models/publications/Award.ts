import { Schema } from 'mongoose';
import { Publication } from '../Publication';

export const Project = Publication.discriminator('Thesis', new Schema({
  type: { type: String, required: true, enum: ['national', 'international', 'autonomic', 'other', 'n/a'], default: 'n/a' },
}));