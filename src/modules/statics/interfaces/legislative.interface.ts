import * as mongoose from 'mongoose';
import { Biography } from './biography.interface';

export interface Legislative extends mongoose.Document {
  name: string;
  role: string;
  title: string;
  lga: string;
  email: string;
  image: string;
  type: string;
  biography: Biography;
  cabinet: Legislative[];
  parentId: mongoose.Types.ObjectId;
  is_deleted: boolean;
  readonly createdAt: Date;
  updatedAt: Date;
}
