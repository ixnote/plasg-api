import { Schema } from 'mongoose';
import { Team } from '../interfaces/team.interface';

export const TeamSchema = new Schema<Team>({
  name: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: false,
  },
});
