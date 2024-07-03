import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsString,
} from 'class-validator';

export class GetMdaDto {
  @ApiProperty()
  @IsString()
  @IsMongoId()
  mdaId: string;
}
