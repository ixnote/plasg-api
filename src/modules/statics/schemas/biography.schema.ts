import { Schema } from 'mongoose';
import { Biography } from '../interfaces/biography.interface';

export const BiographySchema = new Schema<Biography>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: [String],
    required: false,
  }
});
