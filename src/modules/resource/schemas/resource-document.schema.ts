import { Schema } from 'mongoose';
import { ResourceDocument } from '../interfaces/resource-document.interface';

function transformValue(doc, ret: { [key: string]: any }) {
  delete ret._id;
}

export const ResourceDocumentSchema = new Schema<ResourceDocument>(
  {
    type: {
      type: String,
      required: true,
    },
    url: {
      type: String,
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
