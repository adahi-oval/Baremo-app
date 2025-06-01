import { Schema } from 'mongoose';
import { Publication, IPublication } from '../Publication';

export interface IBook extends IPublication {
  bookType: 'Libro' | 'Capítulo de libro' | 'n/a';
  publisher: string;
  publisherPosition: 'D1' | 'T1' | 'T2' | 'T3' | 'No Indexado' | 'n/a';
  isbn?: string;
}

const bookSchema = new Schema<IBook>({
  bookType: {
    type: String,
    required: true,
    enum: ['Libro', 'Capítulo de libro', 'n/a'],
    default: 'n/a',
  },
  publisher: {
    type: String,
    required: true,
    default: 'n/a',
  },
  publisherPosition: {
    type: String,
    required: true,
    enum: ['D1', 'T1', 'T2', 'T3', 'No Indexado', 'n/a'],
    default: 'n/a',
  },
  isbn: {
    type: String,
  },
});

export const Book = Publication.discriminator<IBook>('Book', bookSchema);
