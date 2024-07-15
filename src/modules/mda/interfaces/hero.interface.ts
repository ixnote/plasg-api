import * as mongoose from 'mongoose';

export interface Hero extends mongoose.Document {
  title: string;
  description: string;
  logo: string
  image: string;
  logo_public_id: string;
  image_public_id: string;
}
