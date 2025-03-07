import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export interface Member extends Document {
  name?: string;
  image?: string;
  title?: string;
  role?: string;
  email?: string;
  constituency?: string;
  party?: string;
  type: string;
  cover_image?: string;
  parent?: mongoose.Types.ObjectId;
}