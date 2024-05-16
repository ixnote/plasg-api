import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsString,
} from 'class-validator';

export class RemoveMdaDto {
  @ApiProperty()
  @IsString()
  @IsMongoId()
  mda: string;
}
