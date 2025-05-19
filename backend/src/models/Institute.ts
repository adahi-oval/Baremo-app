import { Schema, model, Document } from 'mongoose';

export interface IInstitute extends Document {
  instituteName: string;
  puntuacionTotal: number;
}

const instituteSchema = new Schema<IInstitute>({
  instituteName: { type: String, required: true, unique: true },
  puntuacionTotal: { type: Number, required: true, default: 0 }
}, {
  timestamps: true
});

export const Institute = model<IInstitute>('Institute', instituteSchema);