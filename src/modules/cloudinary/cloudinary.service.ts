import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { v2 as cloudinary } from 'cloudinary';
import { throwError } from 'rxjs';

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    console.log()
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      toStream(file.buffer).pipe(upload);
    });
  }

  async deleteFile(public_id: string) {
    if(!public_id) throwError;
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(public_id, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  async createUploadPreset() {
    try {
      const preset = await cloudinary.api.create_upload_preset({
        name: 'plsg',
        folder: 'images',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      });
      return preset;
    } catch (error) {
      throw new Error('Error creating upload preset');
    }
  }
}
