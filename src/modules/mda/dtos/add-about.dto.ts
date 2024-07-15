import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class AddAboutDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  vision: string;

  @ApiProperty()
  @IsString()
  mission: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  image: string;

  @IsString()
  @IsOptional()
  public_id: string;
}
