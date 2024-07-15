import { Schema } from 'mongoose';
import { About } from '../interfaces/about.interface';

export const AboutSchema = new Schema<About>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  vision: {
    type: String,
    required: true,
  },
  mission: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  public_id: {
    type: String,
    required: false,
  },
});
