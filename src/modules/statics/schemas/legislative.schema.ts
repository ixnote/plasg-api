import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { LegislativeTypes } from 'src/common/constants/enum';
import { Legislative } from '../interfaces/legislative.interface';
import { BiographySchema } from './biography.schema';

function transformValue(doc, ret: { [key: string]: any }) {
  delete ret._id;
}

export const LegislativeSchema: Schema = new Schema<Legislative>(
  {
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
    lga: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    biography: {
      type: BiographySchema,
      required: false,
    },
    type: {
      type: String,
      enum: LegislativeTypes,
      required: true,
    },
    start: {
      type: Date,
      required: false,
    },
    end: {
      type: Date,
      required: false,
    },
    is_deleted: {
      type: Boolean,
      default: false,
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

export const LegislativeModel = mongoose.model<Legislative>(
  'Legislative',
  LegislativeSchema,
);
