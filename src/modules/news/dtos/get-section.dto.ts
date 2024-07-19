import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsString,
} from 'class-validator';

export class GetSectionDto {
  @ApiProperty()
  @IsString()
  @IsMongoId()
  sectionId: string
}
