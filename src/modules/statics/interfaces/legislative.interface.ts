import * as mongoose from 'mongoose';

export interface Legislative extends mongoose.Document {
  name: string;
  role: string;
  title: string;
  lga: string;
  email: string;
  image: string;
  type: string;
  start: Date;
  end: Date;
  government: mongoose.Types.ObjectId;
  is_deleted: boolean;
  readonly createdAt: Date;
  updatedAt: Date;
}
