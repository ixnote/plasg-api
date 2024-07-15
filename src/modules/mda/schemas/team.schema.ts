import { Schema } from 'mongoose';
import { Team } from '../interfaces/team.interface';

export const TeamSchema = new Schema<Team>({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
  }
});
