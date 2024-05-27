import * as mongoose from 'mongoose';

export interface Component extends mongoose.Document {
  numberId: number;
  dataFormat: any;
  name: string;
  url: string;
  type: string;
  user: mongoose.Types.ObjectId;
  component: mongoose.Types.ObjectId;
  details: any;
  readonly createdAt: Date;
  updatedAt: Date;
}
