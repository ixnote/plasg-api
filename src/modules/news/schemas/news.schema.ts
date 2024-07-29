import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { News } from '../interfaces/news.interface';

function transformValue(doc, ret: { [key: string]: any }) {
  delete ret._id;
}

export const NewsSchema: Schema = new Schema<News>(
  {
    reference: {
      type: String,
      required: false,
    },
    headline: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: false,
    },
    newsSections: [
      {
        type: Schema.Types.ObjectId,
        ref: 'NewsSection',
        required: false,
      },
    ],
    is_posted: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Tag',
        required: false,
      },
    ],
    mda: {
      type: Schema.Types.ObjectId,
      ref: 'Mda',
      required: true,
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

export const NewsModel = mongoose.model<News>('News', NewsSchema);
