import { Schema } from 'mongoose';
import { ResourceDocument } from '../interfaces/resource-document.interface';

export const ResourceDocumentSchema = new Schema<ResourceDocument>({
  type: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  }
});
