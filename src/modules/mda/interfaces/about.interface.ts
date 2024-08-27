import * as mongoose from 'mongoose';

export interface About extends mongoose.Document {
  title: string;
  description: string;
  vision: string;
  mission: string;
  image: string;
  info: string;
}
