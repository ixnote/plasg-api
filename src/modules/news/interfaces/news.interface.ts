import * as mongoose from 'mongoose';

export interface News extends mongoose.Document {
  header: string;
  newsSections: mongoose.Types.ObjectId[];
  tags: mongoose.Types.ObjectId[];
  is_posted: boolean;
}
