import * as mongoose from 'mongoose';

export interface NewsSection extends mongoose.Document {
  heading: string;
  highlight: string;
  text: string;
  paragraph: string,
  video: string,
  hyperlink: string;
  image: string,
  bullet: string,
  sub_heading: string,
  news: mongoose.Types.ObjectId;
  readonly createdAt: Date;
  updatedAt: Date;
}
