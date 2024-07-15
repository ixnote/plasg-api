import { Schema } from 'mongoose';
import { Hero } from '../interfaces/hero.interface';

export const HeroSchema = new Schema<Hero>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },

  logo_public_id: {
    type: String,
    required: true,
  },
    image_public_id: {
    type: String,
    required: true,
  },
});
