import { Document } from 'mongoose';
import { Member } from './member.interface';
import { Biography } from './biography.interface';

export interface Politics extends Document {
  details?: Member;
  biography?: Biography;
}