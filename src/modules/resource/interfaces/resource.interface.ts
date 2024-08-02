import * as mongoose from 'mongoose';

export interface Resource extends mongoose.Document {
  name: string;
  title: string;
  link: string;
  image: string;
  mda: mongoose.Types.ObjectId;
  body: string;
  document: string;
  description: string;
  slug: string;
  main_type_tag: mongoose.Types.ObjectId;
  sub_type_tag: mongoose.Types.ObjectId;
  main_topic_tag: mongoose.Types.ObjectId;
  sub_topic_tag: mongoose.Types.ObjectId;
  all_topic_tags: mongoose.Types.ObjectId[];
  readonly createdAt: Date;
  updatedAt: Date;
}
