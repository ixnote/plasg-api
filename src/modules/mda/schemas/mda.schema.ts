import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { Mda } from '../interfaces/mda.interface';

function transformValue(doc, ret: { [key: string]: any }) {
  delete ret._id;
}

export const MdaSchema: Schema = new Schema<Mda>(
  {
    name: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: false,
    },
    logo: {
        type: String,
        required: false,
      },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    is_suspended: {
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


export const UserModel = mongoose.model<Mda>('Mda', MdaSchema);
