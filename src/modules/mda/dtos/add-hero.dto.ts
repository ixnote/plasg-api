import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class AddHeroDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  image: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  logo: string;

  @IsString()
  @IsOptional()
  logo_public_id: string;

  @IsString()
  @IsOptional()
  image_public_id: string;
}
