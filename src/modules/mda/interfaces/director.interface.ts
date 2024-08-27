import * as mongoose from 'mongoose';

export interface Director extends mongoose.Document {
  position: string;
  title: string;
  image: string;
  name: string;
  message: string;
  public_id: string;
}
