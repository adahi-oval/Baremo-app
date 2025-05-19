import { Schema } from 'mongoose';
import { Publication } from '../Publication';

export const Conference = Publication.discriminator('Conference', new Schema({
  conferenceType: { type: String, required: true, enum: ['international', 'national'] },
  contributionType: { type: String, required: true, enum: ['oral', 'poster', 'plenaria', 'invitada'] },
}));