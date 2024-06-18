import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { NewsItem } from '../interfaces/news-item.interface';

function transformValue(doc, ret: { [key: string]: any }) {
  delete ret._id;
}

export const NewsItemSchema: Schema = new Schema<NewsItem>(
  {
    paragraph: {
      type: String,
      required: false,
    },
    image: {
      type: String,
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

export const MdaModel = mongoose.model<NewsItem>('NewsItemSchema', NewsItemSchema);
