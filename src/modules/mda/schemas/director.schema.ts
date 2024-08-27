import { Schema } from 'mongoose';
import { Director } from '../interfaces/director.interface';

export const DirectorSchema = new Schema<Director>({
  position: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  message: {
    type: String,
    required: false,
  },
});
