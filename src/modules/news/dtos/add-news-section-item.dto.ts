import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
} from 'class-validator';

export class AddNewsSectionItemsDto {

  @ApiProperty()
  @IsString()
  @IsOptional()
  image: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  paragraph: string;
}
