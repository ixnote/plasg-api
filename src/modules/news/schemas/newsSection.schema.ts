import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { NewsSection } from '../interfaces/newsSection.interface';

function transformValue(doc, ret: { [key: string]: any }) {
  delete ret._id;
}

export const NewsSectionSchema: Schema = new Schema<NewsSection>(
  {
    type: {
      type: String,
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    value: {
      type: Schema.Types.Mixed, 
      required: true
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
