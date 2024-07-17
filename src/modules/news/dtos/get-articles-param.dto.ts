import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsString,
} from 'class-validator';

export class GetArticlesMdaDto {
  @ApiProperty()
//   @IsString()
//   @IsMongoId()
  mdaId: string
}
