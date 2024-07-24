import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { Mda } from '../interfaces/mda.interface';
import { TeamSchema } from './team.schema';
import { ContactSchema } from './contact.schema';
import { DirectorSchema } from './director.schema';
import { AboutSchema } from './about.schema';
import { HeroSchema } from './hero.schema';

function transformValue(doc, ret: { [key: string]: any }) {
  delete ret._id;
}

export const MdaSchema: Schema = new Schema<Mda>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: false,
    },
    abbreviation: {
      type: String,
      required: false,
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    about: {
      type: AboutSchema,
      required: false
    },
    team: {
      type: [TeamSchema],
      required: false
    },
    contact: {
      type: ContactSchema,
      required: false
    },
    director: {
      type: DirectorSchema,
      required: false
    },
    hero: {
      type: HeroSchema,
      required: false
    },
    published: {
      type: Boolean,
      default: false
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


export const MdaModel = mongoose.model<Mda>('Mda', MdaSchema);
