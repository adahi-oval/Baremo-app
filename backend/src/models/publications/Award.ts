import { Schema } from 'mongoose';
import { Publication } from '../Publication';

export const Award = Publication.discriminator('Award', new Schema({
  awardType: { type: String, required: true, enum: ['national', 'international', 'autonomic', 'other', 'n/a'], default: 'n/a' },
}));