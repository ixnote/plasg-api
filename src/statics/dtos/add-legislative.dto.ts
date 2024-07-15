import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
  IsOptional,
  IsString,
} from 'class-validator'; 

export class AddLegislativeDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  role?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsString()
  lga: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty()
  file?: any;
}