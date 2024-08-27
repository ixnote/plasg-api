import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class ReorderNewsSectionItemsDto {
  @ApiProperty()
  @IsArray()
  sections: { id: string; position: number }[];
}
