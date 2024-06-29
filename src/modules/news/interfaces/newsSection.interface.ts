import * as mongoose from 'mongoose';

export interface NewsSection extends mongoose.Document {
  heading: string;
  highlight: string;
  text: string;
  paragraph: string,
  image: string,
  news: mongoose.Types.ObjectId;
  readonly createdAt: Date;
  updatedAt: Date;
}
