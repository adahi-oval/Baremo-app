import { Schema } from 'mongoose';
import { Publication, IPublication } from '../Publication';

export interface IProject extends IPublication {
  projectType: 'regional' | 'national' | 'erasmus, interregional o similar' | 'H2020 o HEurope' | 'n/a';
  role: '(co)ip' | 'member' | 'n/a';
}

const projectSchema = new Schema<IProject>({
  projectType: {
    type: String,
    required: true,
    enum: ['regional', 'national', 'erasmus, interregional o similar', 'H2020 o HEurope', 'n/a'],
    default: 'n/a',
  },
  role: {
    type: String,
    required: true,
    enum: ['(co)ip', 'member', 'n/a'],
    default: 'n/a',
  },
});

export const Project = Publication.discriminator<IProject>('Project', projectSchema);
