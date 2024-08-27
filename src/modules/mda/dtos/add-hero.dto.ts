import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class AddHeroDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsUrl()
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty()
  @IsUrl()
  @IsString()
  @IsOptional()
  logo: string;
}
