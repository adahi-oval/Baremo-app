import { Schema } from 'mongoose';
import { Publication } from '../Publication';

export const Book = Publication.discriminator('Book', new Schema({
  bookType: { type: String, required: true, enum: ['Libro', 'Capítulo de libro'] },
  publisher: { type: String, required: true },
  publisherPosition: { type: String, required: true, enum: ['D1', 'T1', 'T2', 'T3', 'No Indexado'], 
    default: 'No Indexado' },
  isbn: { type: String },
}));