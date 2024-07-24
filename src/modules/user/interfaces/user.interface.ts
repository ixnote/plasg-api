import * as mongoose from 'mongoose';
import { UserCode } from './user-code.interface';

export interface User extends mongoose.Document {
  full_name: string;
  email: string;
  phone: string;
  role: string;
  is_confirmed: boolean;
  refreshToken: string;
  password: string;
  address: string;
  company_logo: string;
  password_updated: boolean;
  is_suspended: boolean;
  is_deleted: boolean;
  mda: mongoose.Types.ObjectId; 
  otp: UserCode;
  readonly createdAt: Date;
  updatedAt: Date;
}
