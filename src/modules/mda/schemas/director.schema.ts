import { Schema } from 'mongoose';
import { Director } from '../interfaces/director.interface';

export const DirectorSchema = new Schema<Director>({
  position: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },

  public_id: {
    type: String,
    required: true,
  },
});
