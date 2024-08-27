import * as mongoose from 'mongoose';

export interface Project extends mongoose.Document {
  name: string;
  location: string;
  image: string;
  status: string;
  mda: mongoose.Types.ObjectId;
  is_deleted: boolean;
  readonly createdAt: Date;
  updatedAt: Date;
}
