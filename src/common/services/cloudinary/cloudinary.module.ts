import { Module } from '@nestjs/common';
import { Cloudinary } from './cloudinary';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  providers: [Cloudinary, CloudinaryService, CloudinaryProvider],
  exports: [CloudinaryProvider, CloudinaryService]
})
export class CloudinaryModule {}
