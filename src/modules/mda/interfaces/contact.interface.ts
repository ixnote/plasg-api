import * as mongoose from 'mongoose';

export interface Contact extends mongoose.Document {
  name: string;
  location: string;
  phone: string;
  email: string;
}
