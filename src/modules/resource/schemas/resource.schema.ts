import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { Resource } from '../interfaces/resource.interface';

export interface Point {
  type: string;
  coordinates: number[];
}

function transformValue(doc, ret: { [key: string]: any }) {
  delete ret._id;
}

export const ResourceSchema: Schema = new Schema<Resource>(
  {
    name: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    mda: {
      type: Schema.Types.ObjectId,
      ref: 'Resource',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    main_type_tag: {
      type: Schema.Types.ObjectId,
      ref: 'Tag',
      required: true,
    },
    sub_type_tag: {
      type: Schema.Types.ObjectId,
      ref: 'Tag',
      required: false,
    },
    main_topic_tag: {
      type: Schema.Types.ObjectId,
      ref: 'Tag',
      required: true,
    },
    all_topic_tags: {
      type: [Schema.Types.ObjectId],
      ref: 'Tag',
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

export const ResourceModel = mongoose.model<Resource>('Resource', ResourceSchema);
