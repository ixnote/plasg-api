import * as mongoose from 'mongoose';

export interface Tag extends mongoose.Document {
  name: string;
  description: string,
  sub_tags: mongoose.Schema.Types.ObjectId [];
  type: string,
  parent: mongoose.Types.ObjectId;
  deleted: boolean,
  readonly createdAt: Date;
  updatedAt: Date;
}
