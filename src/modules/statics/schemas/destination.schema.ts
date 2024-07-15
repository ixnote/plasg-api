import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { Destination } from '../interfaces/destination.interface';
import { DestinationTypes } from 'src/common/constants/enum';

function transformValue(doc, ret: { [key: string]: any }) {
  delete ret._id;
}

export const DestinationSchema: Schema = new Schema<Destination>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      enum: DestinationTypes,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: false,
    },
    is_deleted: {
        type: Boolean,
       default: false,
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

export const DestinationModel = mongoose.model<Destination>(
  'Destination',
  DestinationSchema,
);
