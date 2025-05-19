import { Schema, model, Document } from 'mongoose';
import { IUser } from './User';

export type AwardType = 'national' | 'international' | 'autonomic' | 'other';

export interface IAward extends Document {
  researcher: Schema.Types.ObjectId | IUser;
  name: string;
  type: AwardType;
  score: number;
}

const awardSchema = new Schema<IAward>({
  researcher: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['national', 'international', 'autonomic', 'other'],
    required: true,
  },
  score: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true
});

export const Award = model<IAward>('Award', awardSchema);
