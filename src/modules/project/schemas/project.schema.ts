import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { Project } from '../interfaces/project.interface';
import { ProjectStatus } from 'src/common/constants/enum';

export interface Point {
  type: string;
  coordinates: number[];
}

function transformValue(doc, ret: { [key: string]: any }) {
  delete ret._id;
}

export const ProjectSchema: Schema = new Schema<Project>(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ProjectStatus,
      required: false,
    },
    mda: {
      type: Schema.Types.ObjectId,
      ref: 'Mda',
      required: true,
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

export const ProjectModel = mongoose.model<Project>('Project', ProjectSchema);
