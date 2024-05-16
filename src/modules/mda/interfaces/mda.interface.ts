import * as mongoose from 'mongoose';

export interface Mda extends mongoose.Document {
  name: string;
  contact: string;
  logo: string;
  admin: mongoose.Types.ObjectId;
  is_suspended: boolean;
  is_deleted: boolean;
  readonly createdAt: Date;
  updatedAt: Date;
}
