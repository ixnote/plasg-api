import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
} from 'class-validator'; 

export class GetGovernmentDto {
  @ApiProperty()
  @IsMongoId()
  governmentId: string;
}
