import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
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
  file: any
}
