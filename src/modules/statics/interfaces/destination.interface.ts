import * as mongoose from 'mongoose';

export interface Destination extends mongoose.Document {
  name: string;
  description: string;
  type: string;
  image: string;
  public_id: string;
  is_deleted: boolean;
  readonly createdAt: Date;
  updatedAt: Date;
}
