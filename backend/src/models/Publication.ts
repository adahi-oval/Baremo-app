import { Schema, model, Document, Model } from 'mongoose';
import { IUser, User } from './User';
import { number } from 'zod';

export interface IPublication extends Document {
  pubType: string;
  title: string;
  user: Schema.Types.ObjectId | IUser;
  score: number;
  year: number;
  complete: boolean;
  [key: string]: any; // más keys
}

export interface IPublicationMethods extends Model<IPublication> {
  findAllMeritsByResearcherId(researcherId: number): Promise<IPublication[] | null>;
  findCompleteMeritsByResearcherId(researcherId: number): Promise<IPublication[] | null>;
  findIncompleteMeritsByResearcherId(researcherId: number): Promise<IPublication[] | null>;
}

const baseOptions = {
  discriminatorKey: 'pubType',
  collection: 'publications',
  timestamps: true
};

const publicationSchema = new Schema<IPublication>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, default: 'n/a' },
  title: { type: String, required: true, default: 'n/a' },
  score: { type: Number, required: true, default: 0 },
  complete: { type: Boolean, required: true, default: false },
  year: { type: Number, required: true, default: -1 }
}, baseOptions);

publicationSchema.statics.findAllMeritsByResearcherId = async function (researcherId: number): Promise<IPublication[] | null> {
  const user = await User.findIdByResearcherId(researcherId);

  return this.find({ user: user });
}

publicationSchema.statics.findAllCompleteMeritsByResearcherId = async function (researcherId: number): Promise<IPublication[] | null> {
  const user = await User.findIdByResearcherId(researcherId);

  return this.find({ user: user, complete: true });
}

publicationSchema.statics.findAllIncompleteMeritsByResearcherId = async function (researcherId: number): Promise<IPublication[] | null> {
  const user = await User.findIdByResearcherId(researcherId);

  return this.find({ user: user, complete: false });
}

publicationSchema.statics.findActiveIncompleteMeritsByResearcherId = async function (researcherId: number): Promise<IPublication[] | null> {
  const user = await User.findIdByResearcherId(researcherId);
  const currentYear: number = new Date(Date.now()).getFullYear();

  return this.find({ user: user, complete: false, year: { $in: [currentYear - 1, currentYear] } });
}

publicationSchema.statics.findActiveCompleteMeritsByResearcherId = async function (researcherId: number): Promise<IPublication[] | null> {
  const user = await User.findIdByResearcherId(researcherId);
  const currentYear: number = new Date(Date.now()).getFullYear();

  return this.find({ user: user, complete: true, year: { $in: [currentYear - 1, currentYear] } });
}

publicationSchema.statics.findAllActiveMeritsByResearcherId = async function (researcherId: number): Promise<IPublication[] | null> {
  const user = await User.findIdByResearcherId(researcherId);
  const currentYear: number = new Date(Date.now()).getFullYear();

  return this.find({ user: user, year: { $in: [currentYear - 1, currentYear] } });
}

// pre save hook para determinar si está o no completa la publicación
publicationSchema.pre('save', function (next) {
  const doc = this as IPublication;

  const keysToCheck = Object.keys(doc.toObject()).filter(key =>
    key !== 'complete' && key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt'
  )

  doc.complete = keysToCheck.every((key) => {
    const value = doc[key];
    return value !== 'n/a' && value !== undefined && value !== null && value !== -1;
  });

  next();
});

export const Publication = model<IPublication, IPublicationMethods>('Publication', publicationSchema);
