import { Schema } from 'mongoose';
import { Hero } from '../interfaces/hero.interface';

export const HeroSchema = new Schema<Hero>({
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  logo: {
    type: String,
    required: false,
  },
});
