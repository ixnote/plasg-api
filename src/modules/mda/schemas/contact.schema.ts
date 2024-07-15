import { Schema } from 'mongoose';
import { Contact } from '../interfaces/contact.interface';

export const ContactSchema = new Schema<Contact>({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  }
});
