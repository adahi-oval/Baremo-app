import { Schema } from 'mongoose';
import { Publication, IPublication } from '../Publication';

export interface IMagazine extends IPublication {
}

const magazineSchema = new Schema<IMagazine>({});

export const Captacion = Publication.discriminator<IMagazine>('Magazine', magazineSchema);