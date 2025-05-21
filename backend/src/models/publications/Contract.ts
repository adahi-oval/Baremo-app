import { Schema } from 'mongoose';
import { Publication } from '../Publication';

export const Contract = Publication.discriminator('Contract', new Schema({
  role: { type: String, required: true, enum: ['coordinator', 'member', 'n/a'], default: 'n/a' },
}));