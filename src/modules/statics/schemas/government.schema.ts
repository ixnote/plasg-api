import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { Government } from '../interfaces/government.interface';
import { BiographySchema } from './biography.schema';
import { MemberSchema } from './member.schema';

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
    biography: {
      type: BiographySchema
    },
    governor: {
      type: Schema.Types.ObjectId,
      ref: 'Legislative',
      required: false,
      default: null,
    },
    executives: {
      type: [MemberSchema],
      required: false,
      default: null,
    },
    members: {
      type: [MemberSchema],
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
