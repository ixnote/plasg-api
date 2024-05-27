import { Schema } from 'mongoose';
import * as argon2 from 'argon2';
import * as mongoose from 'mongoose';
import { User } from '../interfaces/user.interface';
import { UserRoles } from 'src/common/constants/enum';

export interface Point {
  type: string;
  coordinates: number[];
}

function transformValue(doc, ret: { [key: string]: any }) {
  delete ret._id;
}

export const UserSchema: Schema = new Schema<User>(
  {
    full_name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      unique: true,
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Email should be valid',
      ],
    },
    role: {
      type: String,
      enum: UserRoles,
      required: false,
    },
    password: {
      type: String,
      select: false,
      required: false,
    },
    refreshToken: {
      type: String,
    },
   company_logo: {
      type: String,
      required: false,
    },
    address: {
      type: String,
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

UserSchema.virtual('mdas', {
  ref: 'Mda',
  localField: '_id',
  foreignField: 'admin',
  justOne: false,
});

export const UserModel = mongoose.model<User>('User', UserSchema);
