import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class AddDirectorDto {
  @ApiProperty()
  @IsString()
  position: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  image: string;

  @ApiProperty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  public_id: string;
}
