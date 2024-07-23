import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator'; 
import { LegislativeTypes } from 'src/common/constants/enum';

export class AddLegislativeDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
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
  @IsEnum(LegislativeTypes)
  type: string
}
