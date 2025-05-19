import { Schema, model, Document } from 'mongoose';
import { IUser } from './User';

export interface IPublication extends Document {
  pubType: string;
  title: string;
  researcher: Schema.Types.ObjectId | IUser;
  score: number;
  complete: boolean;
}

const baseOptions = {
  discriminatorKey: 'pubType',
  collection: 'publications',
  timestamps: true
};

const publicationSchema = new Schema<IPublication>({
  researcher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  score: { type: Number, required: true },
  complete: { type: Boolean, required: true, default: false }
}, baseOptions);

export const Publication = model<IPublication>('Publication', publicationSchema);
