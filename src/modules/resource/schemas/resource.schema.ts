import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { Resource } from '../interfaces/resource.interface';
import { ResourceDocumentSchema } from './resource-document.schema';

function transformValue(doc, ret: { [key: string]: any }) {
  delete ret._id;
}

export const ResourceSchema: Schema = new Schema<Resource>(
  {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    link: {
      type: String,
      required: false,
    },
    mda: {
      type: Schema.Types.ObjectId,
      ref: 'Mda',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: false,
    },
    body: {
      type: String,
      required: false,
    },
    document: {
      type: ResourceDocumentSchema,
      required: false,
    },
    slug: {
      type: String,
      required: false,
    },
    view_count: {
      type: Number,
      default: 0,
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
    sub_topic_tag: {
      type: Schema.Types.ObjectId,
      ref: 'Tag',
      required: false,
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

export const ResourceModel = mongoose.model<Resource>(
  'Resource',
  ResourceSchema,
);
