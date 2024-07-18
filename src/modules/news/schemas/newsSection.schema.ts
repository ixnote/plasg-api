import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { NewsSection } from '../interfaces/newsSection.interface';

function transformValue(doc, ret: { [key: string]: any }) {
  delete ret._id;
}

export const NewsSectionSchema: Schema = new Schema<NewsSection>(
  {
    heading: {
      type: String,
      required: false,
    },
    highlight: {
      type: String,
      required: false,
    },
    text: {
      type: String,
      required: false,
    },
    paragraph: {
      type: String,
      required: false,
    },
    bullet: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    hyperlink: {
      type: String,
      required: false,
    },
    video: {
      type: String,
      required: false,
    },
    sub_heading: {
      type: String,
      required: false,
    },
    news: {
      type: Schema.Types.ObjectId,
      ref: 'News',
      required: false,
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: transformValue,
    },
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: transformValue,
    },
  },
);

export const MdaModel = mongoose.model<NewsSection>(
  'NewsSchema',
  NewsSectionSchema,
);
