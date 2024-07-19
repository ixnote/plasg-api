import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
  IsMongoId,
  IsOptional,
} from 'class-validator';

export class AddNewsTagsDto {
    @ApiProperty()
    @IsArray()
    @IsMongoId({ each: true }) 
    @IsOptional()
    tags: string[];
}
