import { Schema } from 'mongoose';
import { Publication } from '../Publication';

export const Article = Publication.discriminator('Article', new Schema({
  index: { type: String, required: true, enum: ['JCR', 'SJR', 'No Indexado'] },
  position: { type: String, required: true, enum: ['D1', 'Q1', 'Q2', 'Q3', 'Q4', 'No Indexado'], default: 'No Indexado'},
}));
