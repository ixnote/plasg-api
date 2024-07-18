import { Schema } from 'mongoose';
import { Contact } from '../interfaces/contact.interface';

export const ContactSchema = new Schema<Contact>({

  location: {
    type: String,
    required: false,
  },
  phone_number_1: {
    type: String,
    required: false,
  },
  phone_number_2: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  }
});
