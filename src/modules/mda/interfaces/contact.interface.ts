import * as mongoose from 'mongoose';

export interface Contact extends mongoose.Document {
  name: string;
  location: string;
  phone_number_1: string;
  phone_number_2: string;
  email: string;
}
