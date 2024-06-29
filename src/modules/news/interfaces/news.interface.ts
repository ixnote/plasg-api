import * as mongoose from 'mongoose';

export interface News extends mongoose.Document {
  reference: string;
  headline: string;
  image: string,
  newsSections: mongoose.Types.ObjectId[];
  tags: mongoose.Types.ObjectId[];
  is_posted: boolean;
}
