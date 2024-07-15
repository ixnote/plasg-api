import * as mongoose from 'mongoose';

export interface Team extends mongoose.Document {
  name: string;
  image: string;
  role: string;
  public_id: string;
}
