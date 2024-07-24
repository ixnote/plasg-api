import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class AddAboutDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  info: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  vision: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  mission: string;

  @ApiProperty()
  @IsUrl()
  @IsString()
  @IsOptional()
  image: string;
}
