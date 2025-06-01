import { Schema } from 'mongoose';
import { Publication, IPublication } from '../Publication';

export interface IConference extends IPublication {
  conferenceType: 'international' | 'national' | 'n/a';
  contributionType: 'oral' | 'poster' | 'plenaria' | 'invitada' | 'n/a';
}

const conferenceSchema = new Schema<IConference>({
  conferenceType: {
    type: String,
    required: true,
    enum: ['international', 'national', 'n/a'],
    default: 'n/a',
  },
  contributionType: {
    type: String,
    required: true,
    enum: ['oral', 'poster', 'plenaria', 'invitada', 'n/a'],
    default: 'n/a',
  },
});

export const Conference = Publication.discriminator<IConference>('Conference', conferenceSchema);
