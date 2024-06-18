import * as mongoose from 'mongoose';

export interface NewsItem extends mongoose.Document {
  paragraph: string;
  image: string;
}
