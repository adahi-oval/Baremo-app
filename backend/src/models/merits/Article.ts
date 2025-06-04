import { Schema } from 'mongoose';
import { Publication, IPublication } from '../Publication';

export interface IArticle extends IPublication {
  index: 'jcr' | 'sjr' | 'no indexado' | 'n/a';
  position: 'hcp' | 'd1' | 'q1' | 'q2' | 'q3' | 'q4' | 'no indexado' | 'n/a';
}

const articleSchema = new Schema<IArticle>({
  index: {
    type: String,
    required: true,
    enum: ['jcr', 'sjr', 'no indexado', 'n/a'],
    default: 'n/a',
  },
  position: {
    type: String,
    required: true,
    enum: ['hcp', 'd1', 'q1', 'q2', 'q3', 'q4', 'no indexado', 'n/a'],
    default: 'n/a',
  },
});

export const Article = Publication.discriminator<IArticle>('Article', articleSchema);
