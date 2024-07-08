import * as mongoose from 'mongoose';

export interface Legislative extends mongoose.Document {
  name: string;
  role: string;
  title: string;
  lga: string;
  email: string;
  image: string;
  public_id: string;
  is_deleted: boolean;
  readonly createdAt: Date;
  updatedAt: Date;
}
