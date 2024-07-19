import * as mongoose from 'mongoose';

export interface NewsSection extends mongoose.Document {
  type: string,
  value: any,
  position: number,
  news: mongoose.Types.ObjectId;
  readonly createdAt: Date;
  updatedAt: Date;
}
