import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { NewsSectionTypes } from 'src/common/constants/enum';

export class AddNewsSectionItemsDto {
  @ApiProperty()
  @IsString()
  @IsEnum(NewsSectionTypes)
  type: string;

  @ApiProperty()
  @IsNumber()
  position: number;

  @ApiProperty()
  value: any;
}
