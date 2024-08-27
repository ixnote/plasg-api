import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
} from 'class-validator'; 

export class GetDestinationDto {
  @ApiProperty()
  @IsMongoId()
  destinationId: string;
}
