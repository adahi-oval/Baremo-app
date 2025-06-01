import { Schema } from 'mongoose';
import { Publication, IPublication } from '../Publication';

export interface IContract extends IPublication {
  role: 'coordinator' | 'member' | 'n/a';
}

const contractSchema = new Schema<IContract>({
  role: {
    type: String,
    required: true,
    enum: ['coordinator', 'member', 'n/a'],
    default: 'n/a',
  },
});

export const Contract = Publication.discriminator<IContract>('Contract', contractSchema);
