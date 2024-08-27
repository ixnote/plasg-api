import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
} from 'class-validator';

export class GetMdaBySlugDto {
  @ApiProperty()
  @IsString()
  slug: string;
}
