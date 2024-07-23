import * as mongoose from 'mongoose';

export interface Biography extends mongoose.Document {
  title: string;
  description: string[];
}
