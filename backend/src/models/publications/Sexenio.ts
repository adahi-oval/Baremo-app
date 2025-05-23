import { Schema } from 'mongoose';
import { Publication } from '../Publication';

export const Sexenio = Publication.discriminator('Sexenio', new Schema({
  active: { type: Boolean, required: true, default: 0 }
}));