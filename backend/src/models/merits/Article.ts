import { Schema } from 'mongoose';
import { Publication, IPublication } from '../Publication';

export interface IArticle extends IPublication {
  index: 'JCR' | 'SJR' | 'No Indexado' | 'n/a';
  position: 'HCP' | 'D1' | 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'No Indexado' | 'n/a';
}

const articleSchema = new Schema<IArticle>({
  index: {
    type: String,
    required: true,
    enum: ['JCR', 'SJR', 'No Indexado', 'n/a'],
    default: 'n/a',
  },
  position: {
    type: String,
    required: true,
    enum: ['HCP', 'D1', 'Q1', 'Q2', 'Q3', 'Q4', 'No Indexado', 'n/a'],
    default: 'n/a',
  },
});

export const Article = Publication.discriminator<IArticle>('Article', articleSchema);
