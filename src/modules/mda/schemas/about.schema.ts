import { Schema } from 'mongoose';
import { About } from '../interfaces/about.interface';

export const AboutSchema = new Schema<About>({
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  vision: {
    type: String,
    required: false,
  },
  mission: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
});
