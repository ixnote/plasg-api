import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator'; 
import { DestinationTypes } from 'src/common/constants/enum';

export class AddDestinationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsEnum(DestinationTypes)
  type: string;

  @ApiProperty()
  @IsOptional()
  file?: any

  @ApiProperty()
  @IsOptional()
  image: any

  @ApiProperty()
  @IsOptional()
  public_id?: any
}
