import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
  IsOptional,
  IsString,
} from 'class-validator'; 

export class AddBiographyDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  description: string[];
}
