import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserCode } from '../interfaces/user-code.interface';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  full_name?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  is_confirmed?: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  mappedLocations?: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  refreshToken?: string;

  // @ApiProperty()
  // @IsString()
  // @IsOptional()
  // otp?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  store_name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  store_details?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  is_suspended?: boolean;

  @ApiProperty()
  @IsOptional()
  code?: UserCode;

  @ApiProperty()
  @IsOptional()
  otp?: UserCode;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  is_deleted?: boolean;
}
