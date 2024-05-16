import * as mongoose from 'mongoose';

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
  is_suspended: boolean;
  is_deleted: boolean;
  readonly createdAt: Date;
  updatedAt: Date;
}
