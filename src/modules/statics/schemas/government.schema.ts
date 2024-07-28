import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { BiographySchema } from './biography.schema';
import { Government } from '../interfaces/government.interface';

function transformValue(doc, ret: { [key: string]: any }) {
  delete ret._id;
}

export const GovernmentSchema: Schema = new Schema<Government>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    start: {
      type: Date,
      required: false,
    },
    end: {
      type: Date,
      required: false,
    },
    governor: {
      type: Schema.Types.ObjectId,
      ref: 'Legislative',
      required: false,
      default: null,
    },
    executives: {
      type: [Schema.Types.ObjectId],
      ref: 'Legislative',
      required: false,
      default: null,
    },
    members: {
      type: [Schema.Types.ObjectId],
      ref: 'Legislative',
      required: false,
      default: null,
    },
    active: {
      type: Boolean,
      default: false,
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

export const GovernmentModel = mongoose.model<Government>(
  'Government',
  GovernmentSchema,
);
