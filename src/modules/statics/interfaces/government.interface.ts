import * as mongoose from 'mongoose';
import { Legislative } from './legislative.interface';

export interface Government extends mongoose.Document {
  name: string;
  image: string;
  start: Date;
  end: Date;
  active: boolean;
  governor: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  executives:  mongoose.Types.ObjectId[];
  is_deleted: boolean;
  readonly createdAt: Date;
  updatedAt: Date;
}
