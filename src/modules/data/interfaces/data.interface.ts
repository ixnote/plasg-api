import * as mongoose from 'mongoose';

export interface Data extends mongoose.Document {
  name: string;
  url: string;
  type: string;
  user: mongoose.Types.ObjectId;
  component: mongoose.Types.ObjectId;
  details: any;
  readonly createdAt: Date;
  updatedAt: Date;
}
