import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class GetTeamDto {
  @ApiProperty()
  @IsString()
  @IsMongoId()
  mdaId: string;

  @ApiProperty()
  @IsString()
  name: string;
}
