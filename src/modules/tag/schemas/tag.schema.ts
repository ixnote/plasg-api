import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { Tag } from '../interfaces/tag.interface';
import { TagType } from 'src/common/constants/enum';

function transformValue(doc, ret: { [key: string]: any }) {
  delete ret._id;
}

export const TagSchema: Schema = new Schema<Tag>(
  {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      default: '',
      required: false,
    },
    sub_tags: {
      type: [Schema.Types.ObjectId],
      ref: 'Tag',
      required: false,
    },
    type: {
      type: String,
      enum: TagType,
      required: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Tag',
      required: false,
    },
    deleted: {
      type: Boolean,
      default: false
    }
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

export const UserModel = mongoose.model<Tag>('Tag', TagSchema);
