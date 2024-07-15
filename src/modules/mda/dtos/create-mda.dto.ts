import { UserRoles } from 'src/common/constants/enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AddContactDto } from './add-contact.dto';
import { AddDirectorDto } from './add-director.dto';
import { AddTeamMembersDto } from './add-team.dto';
import { Type } from 'class-transformer';
import { AddAboutDto } from './add-about.dto';
import { AddHeroDto } from './add-hero.dto';

export class CreateMdaDto {
  @ApiProperty()
  @IsString()
  name: string;
  
  @ApiProperty()
  @IsOptional()
  about: AddAboutDto

  @ApiProperty()
  @IsOptional()
  contact: AddContactDto

  @ApiProperty()
  @IsOptional()
  director: AddDirectorDto

  @ApiProperty()
  @IsOptional()
  hero: AddHeroDto

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() =>  AddTeamMembersDto)
  team: AddTeamMembersDto[];

}
