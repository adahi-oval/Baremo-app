import { Schema } from 'mongoose';
import { Publication } from '../Publication';

export const Project = Publication.discriminator('Project', new Schema({
  projectType: { type: String, required: true, enum: ['regional', 'national', 'erasmus, interregional o similar', 'H2020 o HEurope', 'n/a'], default: 'n/a' },
  role: { type: String, required: true, enum: ['(co)ip', 'member', 'n/a'], default: 'n/a' },
}));