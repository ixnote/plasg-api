import * as mongoose from 'mongoose';
import { FileTag } from '../interfaces/file-tags.schema';

export interface File extends mongoose.Document {
  name: string;
  url: string;
  type: string;
  tags: FileTag[];
  user: mongoose.Types.ObjectId;
  readonly createdAt: Date;
  updatedAt: Date;
}
