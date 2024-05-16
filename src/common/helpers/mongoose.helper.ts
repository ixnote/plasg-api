import { BadRequestException, Injectable } from '@nestjs/common';
import mongoose, { ObjectId } from 'mongoose';

@Injectable()
export class MongooseService {
  isValidObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
  }

  handleError(message: string, path: string): any {
    throw new BadRequestException({
        success: false,
        message: "Invalid Object ID",
        errors: {
            id: {
                message,
                path, 
            }
        }
    })
  }
}