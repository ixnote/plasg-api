import { Schema } from 'mongoose';
import { UserCode } from '../interfaces/user-code.interface';

export const UserCodeSchema = new Schema<UserCode>({
  token: {
    type: String,
    required: true,
  },
  expirationTime: {
    type: Date,
    required: true,
  }
});
