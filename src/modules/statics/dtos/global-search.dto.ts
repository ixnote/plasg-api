import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GlobalSearchDto {
  @ApiProperty()
  @IsString()
  description: string;
}
