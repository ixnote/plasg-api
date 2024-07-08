import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
} from 'class-validator'; 

export class GetLegislativeDto {
  @ApiProperty()
  @IsMongoId()
  legislativeId: string;
}
