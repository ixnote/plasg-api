import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class GetResourceDto {
  @ApiProperty()
  @IsMongoId()
  resourceId?: string;
}
