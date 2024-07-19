import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateNewsDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  reference: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  headline: string;

}
