import { Schema } from 'mongoose';
import { Publication, IPublication } from '../Publication';

export interface IAward extends IPublication {
  awardType: 'national' | 'international' | 'autonomic' | 'other' | 'n/a';
}

const awardSchema = new Schema<IAward>({
  awardType: {
    type: String,
    required: true,
    enum: ['national', 'international', 'autonomic', 'other', 'n/a'],
    default: 'n/a',
  },
});

export const Award = Publication.discriminator<IAward>('Award', awardSchema);
