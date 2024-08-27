import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsString,
} from 'class-validator';

export class RemoveTagDto {
  @ApiProperty()
  @IsString()
  @IsMongoId()
  tagId: string

  @ApiProperty()
  @IsString()
  @IsMongoId()
  newsId: string
}
