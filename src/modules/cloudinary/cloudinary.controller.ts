import { Controller, Post } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('preset')
  async createPreset() {
    const preset = await this.cloudinaryService.createUploadPreset();
    return preset;
  }
}
