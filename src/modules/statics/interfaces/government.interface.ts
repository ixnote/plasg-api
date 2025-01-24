import * as mongoose from 'mongoose';
import { Biography } from './biography.interface';
import { Member } from './member.interface';

export interface Government extends mongoose.Document {
  name: string;
  image: string;
  biography: Biography;
  start: Date;
  end: Date;
  active: boolean;
  governor: mongoose.Types.ObjectId;
  members: Member[];
  executives:  Member[];
  is_deleted: boolean;
  readonly createdAt: Date;
  updatedAt: Date;
}
