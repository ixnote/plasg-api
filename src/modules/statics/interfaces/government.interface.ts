import * as mongoose from 'mongoose';
import { Biography } from './biography.interface';
import { Member } from './member.interface';
import { Politics } from './politics.interface';

export interface Government extends mongoose.Document {
  name: string;
  image: string;
  biography: Biography;
  start: Date;
  end: Date;
  active: boolean;
  governor: Member;
  members: Member[];
  executives: Member[];
  is_deleted: boolean;
  readonly createdAt: Date;
  updatedAt: Date;
  deputyGovernor: Politics;
  stateSecretary: Politics;
}
