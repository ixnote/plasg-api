import * as mongoose from 'mongoose';

export interface NewsSection extends mongoose.Document {
  paragraph: string;
  image: string;
  news: mongoose.Types.ObjectId;
  readonly createdAt: Date;
  updatedAt: Date;
}
